import {
  Bell,
  Bird,
  Camera,
  Check,
  ChevronRight,
  CircleUserRound,
  Clipboard,
  Flame,
  Gamepad2,
  Heart,
  MessageCircle,
  Play,
  Plus,
  RadioTower,
  Search,
  Send,
  Settings,
  Share2,
  ShoppingBag,
  Sparkles,
  Trophy,
  UserPlus,
  Users,
  Zap
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import {
  challenges,
  demoProfile,
  initialClips,
  initialFriends,
  initialSightings,
  rarityPoints,
  recommendations
} from "./data";
import type { Clip, Friend, Rarity, Sighting, UserProfile } from "./types";

const storageKey = "flock-birdwatch-state";
const rarityOptions: Rarity[] = ["Common", "Uncommon", "Rare", "Legendary"];

type AppState = {
  profile: UserProfile;
  friends: Friend[];
  clips: Clip[];
  sightings: Sighting[];
};

function loadState(): AppState {
  const stored = window.localStorage.getItem(storageKey);
  if (!stored) {
    return {
      profile: demoProfile,
      friends: initialFriends,
      clips: initialClips,
      sightings: initialSightings
    };
  }

  try {
    return JSON.parse(stored) as AppState;
  } catch {
    return {
      profile: demoProfile,
      friends: initialFriends,
      clips: initialClips,
      sightings: initialSightings
    };
  }
}

function saveState(nextState: AppState) {
  window.localStorage.setItem(storageKey, JSON.stringify(nextState));
}

function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [activeTab, setActiveTab] = useState("feed");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [logDraft, setLogDraft] = useState({
    bird: "",
    rarity: "Common" as Rarity,
    location: demoProfile.location,
    source: "Manual log"
  });
  const [profileDraft, setProfileDraft] = useState({
    name: state.profile.name,
    location: state.profile.location,
    favoriteBird: state.profile.favoriteBird
  });
  const [cameraProvider, setCameraProvider] = useState("Birdfy");
  const [motionOnly, setMotionOnly] = useState(true);
  const [copiedInvite, setCopiedInvite] = useState(false);

  function commit(next: AppState) {
    setState(next);
    saveState(next);
  }

  const leaderboard = useMemo(() => {
    const currentUser = {
      id: state.profile.id,
      name: state.profile.name,
      handle: state.profile.handle,
      avatar: state.profile.avatar,
      location: state.profile.location,
      status: "following" as const,
      points: state.profile.points,
      clips: state.clips.filter((clip) => clip.owner === "Charlie").length
    };
    return [currentUser, ...state.friends].sort((a, b) => b.points - a.points);
  }, [state]);

  const totalClips = state.clips.length;
  const rareClips = state.clips.filter((clip) => clip.rarity === "Rare" || clip.rarity === "Legendary").length;
  const followingCount = state.friends.filter((friend) => friend.status === "following").length;
  const weeklyPoints = state.sightings.reduce((sum, sighting) => sum + sighting.points, 0);

  function addSighting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const bird = logDraft.bird.trim();
    if (!bird) return;

    const points = rarityPoints[logDraft.rarity];
    const sighting: Sighting = {
      id: crypto.randomUUID(),
      bird,
      rarity: logDraft.rarity,
      location: logDraft.location.trim() || state.profile.location,
      source: logDraft.source.trim() || "Manual log",
      loggedAt: "Just now",
      points
    };

    const clip: Clip = {
      id: crypto.randomUUID(),
      cameraName: sighting.source,
      bird: sighting.bird,
      rarity: sighting.rarity,
      location: sighting.location,
      capturedAt: "Just now",
      imageUrl: "https://images.unsplash.com/photo-1486365227551-f3f90034a57c?auto=format&fit=crop&w=1000&q=80",
      duration: "00:12",
      confidence: 87,
      motionOnly,
      owner: "Charlie",
      points,
      reactions: 0,
      comments: []
    };

    commit({
      ...state,
      profile: { ...state.profile, points: state.profile.points + points, streak: state.profile.streak + 1 },
      sightings: [sighting, ...state.sightings],
      clips: [clip, ...state.clips]
    });

    setLogDraft({ ...logDraft, bird: "" });
    setActiveTab("feed");
  }

  function addComment(clipId: string) {
    const body = commentDrafts[clipId]?.trim();
    if (!body) return;

    commit({
      ...state,
      clips: state.clips.map((clip) =>
        clip.id === clipId
          ? {
              ...clip,
              comments: [
                ...clip.comments,
                {
                  id: crypto.randomUUID(),
                  author: state.profile.name.split(" ")[0],
                  body,
                  createdAt: "Just now"
                }
              ]
            }
          : clip
      )
    });
    setCommentDrafts({ ...commentDrafts, [clipId]: "" });
  }

  function reactToClip(clipId: string) {
    commit({
      ...state,
      clips: state.clips.map((clip) => (clip.id === clipId ? { ...clip, reactions: clip.reactions + 1 } : clip))
    });
  }

  function followFriend(friendId: string) {
    commit({
      ...state,
      friends: state.friends.map((friend) =>
        friend.id === friendId ? { ...friend, status: friend.status === "following" ? "pending" : "following" } : friend
      )
    });
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    commit({
      ...state,
      profile: {
        ...state.profile,
        name: profileDraft.name.trim() || state.profile.name,
        location: profileDraft.location.trim() || state.profile.location,
        favoriteBird: profileDraft.favoriteBird.trim() || state.profile.favoriteBird
      }
    });
  }

  async function copyInvite() {
    await navigator.clipboard.writeText(state.profile.inviteCode);
    setCopiedInvite(true);
    window.setTimeout(() => setCopiedInvite(false), 1400);
  }

  const tabs = [
    { id: "feed", label: "Feed", icon: Bird },
    { id: "league", label: "League", icon: Trophy },
    { id: "friends", label: "Friends", icon: Users },
    { id: "gear", label: "Gear", icon: ShoppingBag }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Bird size={22} />
          </div>
          <div>
            <strong>Flock</strong>
            <span>BirdWatch</span>
          </div>
        </div>

        <nav className="nav-tabs" aria-label="Primary">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                className={activeTab === tab.id ? "nav-tab active" : "nav-tab"}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                type="button"
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="camera-panel">
          <div className="section-heading compact">
            <RadioTower size={17} />
            <span>Camera Link</span>
          </div>
          <label className="field-label" htmlFor="provider">
            Provider
          </label>
          <select id="provider" value={cameraProvider} onChange={(event) => setCameraProvider(event.target.value)}>
            <option>Birdfy</option>
            <option>Netvue</option>
            <option>Nest Cam</option>
            <option>Manual upload</option>
          </select>
          <label className="toggle-row">
            <input checked={motionOnly} onChange={(event) => setMotionOnly(event.target.checked)} type="checkbox" />
            <span>Motion clips only</span>
          </label>
          <div className="connection-status">
            <span className="status-dot" />
            {cameraProvider} ready
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Backyard network</p>
            <h1>{state.profile.name.split(" ")[0]}'s Flock</h1>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" title="Search clips" type="button">
              <Search size={18} />
            </button>
            <button className="icon-button" title="Notifications" type="button">
              <Bell size={18} />
            </button>
            <button className="profile-chip" onClick={() => setActiveTab("friends")} type="button">
              <span>{state.profile.avatar}</span>
              <strong>{state.profile.handle}</strong>
            </button>
          </div>
        </header>

        <section className="metric-grid" aria-label="Flock metrics">
          <Metric icon={Camera} label="Motion clips" value={totalClips.toString()} tone="blue" />
          <Metric icon={Sparkles} label="Rare hits" value={rareClips.toString()} tone="gold" />
          <Metric icon={Users} label="Following" value={followingCount.toString()} tone="green" />
          <Metric icon={Zap} label="Weekly points" value={weeklyPoints.toString()} tone="coral" />
        </section>

        {activeTab === "feed" && (
          <div className="dashboard-grid">
            <section className="feed-column" aria-label="Camera feed">
              <div className="section-heading">
                <Camera size={19} />
                <div>
                  <h2>Live Clips</h2>
                  <p>Motion-triggered sightings from your cameras and friends.</p>
                </div>
              </div>
              <div className="clip-list">
                {state.clips.map((clip) => (
                  <article className="clip-card" key={clip.id}>
                    <div className="clip-media">
                      <img alt={`${clip.bird} captured by ${clip.cameraName}`} src={clip.imageUrl} />
                      <button className="play-button" title={`Play ${clip.bird} clip`} type="button">
                        <Play size={22} fill="currentColor" />
                      </button>
                      <span className="clip-duration">{clip.duration}</span>
                    </div>
                    <div className="clip-body">
                      <div className="clip-title-row">
                        <div>
                          <h3>{clip.bird}</h3>
                          <p>
                            {clip.cameraName} • {clip.location}
                          </p>
                        </div>
                        <span className={`rarity rarity-${clip.rarity.toLowerCase()}`}>{clip.rarity}</span>
                      </div>
                      <div className="clip-meta">
                        <span>{clip.capturedAt}</span>
                        <span>{clip.confidence}% ID confidence</span>
                        <span>+{clip.points} pts</span>
                      </div>
                      <div className="clip-actions">
                        <button onClick={() => reactToClip(clip.id)} type="button">
                          <Heart size={17} />
                          {clip.reactions}
                        </button>
                        <button type="button">
                          <MessageCircle size={17} />
                          {clip.comments.length}
                        </button>
                        <button type="button">
                          <Share2 size={17} />
                          Share
                        </button>
                      </div>
                      <div className="comment-stack">
                        {clip.comments.map((comment) => (
                          <p key={comment.id}>
                            <strong>{comment.author}</strong> {comment.body}
                          </p>
                        ))}
                      </div>
                      <div className="comment-form">
                        <input
                          aria-label={`Comment on ${clip.bird}`}
                          onChange={(event) => setCommentDrafts({ ...commentDrafts, [clip.id]: event.target.value })}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") addComment(clip.id);
                          }}
                          placeholder="Comment"
                          value={commentDrafts[clip.id] ?? ""}
                        />
                        <button onClick={() => addComment(clip.id)} title="Send comment" type="button">
                          <Send size={17} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="side-stack" aria-label="Logging and recommendations">
              <section className="panel">
                <div className="section-heading compact">
                  <Plus size={18} />
                  <span>Log Sighting</span>
                </div>
                <form className="log-form" onSubmit={addSighting}>
                  <label>
                    <span>Bird</span>
                    <input
                      onChange={(event) => setLogDraft({ ...logDraft, bird: event.target.value })}
                      placeholder="Species"
                      value={logDraft.bird}
                    />
                  </label>
                  <div className="form-grid">
                    <label>
                      <span>Rarity</span>
                      <select
                        onChange={(event) => setLogDraft({ ...logDraft, rarity: event.target.value as Rarity })}
                        value={logDraft.rarity}
                      >
                        {rarityOptions.map((rarity) => (
                          <option key={rarity}>{rarity}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>Source</span>
                      <input
                        onChange={(event) => setLogDraft({ ...logDraft, source: event.target.value })}
                        value={logDraft.source}
                      />
                    </label>
                  </div>
                  <label>
                    <span>Location</span>
                    <input
                      onChange={(event) => setLogDraft({ ...logDraft, location: event.target.value })}
                      value={logDraft.location}
                    />
                  </label>
                  <button className="primary-button" type="submit">
                    <Plus size={17} />
                    Add to Flock
                  </button>
                </form>
              </section>

              <section className="panel">
                <div className="section-heading compact">
                  <Flame size={18} />
                  <span>Streak</span>
                </div>
                <div className="streak-row">
                  <strong>{state.profile.streak}</strong>
                  <span>active sighting days</span>
                </div>
                <div className="sighting-list">
                  {state.sightings.slice(0, 4).map((sighting) => (
                    <div className="sighting-item" key={sighting.id}>
                      <div>
                        <strong>{sighting.bird}</strong>
                        <span>{sighting.source}</span>
                      </div>
                      <em>+{sighting.points}</em>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        )}

        {activeTab === "league" && (
          <div className="league-grid">
            <section className="panel wide">
              <div className="section-heading">
                <Trophy size={20} />
                <div>
                  <h2>Fantasy Flock League</h2>
                  <p>Points are weighted by rarity, verified motion clips, and streaks.</p>
                </div>
              </div>
              <div className="leaderboard">
                {leaderboard.map((member, index) => (
                  <div className="leader-row" key={member.id}>
                    <span className="rank">{index + 1}</span>
                    <span className="avatar">{member.avatar}</span>
                    <div>
                      <strong>{member.name}</strong>
                      <span>
                        {member.handle} • {member.location}
                      </span>
                    </div>
                    <em>{member.points.toLocaleString()} pts</em>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="section-heading compact">
                <Gamepad2 size={18} />
                <span>Challenges</span>
              </div>
              <div className="challenge-list">
                {challenges.map((challenge) => (
                  <article className="challenge-card" key={challenge.id}>
                    <div>
                      <h3>{challenge.name}</h3>
                      <p>{challenge.metric}</p>
                    </div>
                    <div className="progress-track" aria-label={`${challenge.name} progress`}>
                      <span style={{ width: `${Math.min(100, (challenge.progress / challenge.goal) * 100)}%` }} />
                    </div>
                    <div className="challenge-footer">
                      <span>
                        {challenge.progress}/{challenge.goal}
                      </span>
                      <strong>+{challenge.reward}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "friends" && (
          <div className="friends-grid">
            <section className="panel">
              <div className="section-heading">
                <CircleUserRound size={20} />
                <div>
                  <h2>Profile</h2>
                  <p>Your public birding identity and home habitat.</p>
                </div>
              </div>
              <form className="profile-form" onSubmit={saveProfile}>
                <label>
                  <span>Name</span>
                  <input
                    onChange={(event) => setProfileDraft({ ...profileDraft, name: event.target.value })}
                    value={profileDraft.name}
                  />
                </label>
                <label>
                  <span>Location</span>
                  <input
                    onChange={(event) => setProfileDraft({ ...profileDraft, location: event.target.value })}
                    value={profileDraft.location}
                  />
                </label>
                <label>
                  <span>Favorite bird</span>
                  <input
                    onChange={(event) => setProfileDraft({ ...profileDraft, favoriteBird: event.target.value })}
                    value={profileDraft.favoriteBird}
                  />
                </label>
                <button className="primary-button" type="submit">
                  <Check size={17} />
                  Save Profile
                </button>
              </form>
              <div className="invite-box">
                <div>
                  <span>Invite code</span>
                  <strong>{state.profile.inviteCode}</strong>
                </div>
                <button onClick={copyInvite} title="Copy invite code" type="button">
                  {copiedInvite ? <Check size={18} /> : <Clipboard size={18} />}
                </button>
              </div>
            </section>

            <section className="panel wide">
              <div className="section-heading">
                <Users size={20} />
                <div>
                  <h2>Flock Network</h2>
                  <p>Follow friends, compare points, and discover nearby cameras.</p>
                </div>
              </div>
              <div className="friend-list">
                {state.friends.map((friend) => (
                  <article className="friend-card" key={friend.id}>
                    <span className="avatar">{friend.avatar}</span>
                    <div>
                      <h3>{friend.name}</h3>
                      <p>
                        {friend.handle} • {friend.location}
                      </p>
                      <span>{friend.clips} clips</span>
                    </div>
                    <button onClick={() => followFriend(friend.id)} type="button">
                      {friend.status === "following" ? <Check size={17} /> : <UserPlus size={17} />}
                      {friend.status === "following" ? "Following" : friend.status === "pending" ? "Pending" : "Follow"}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "gear" && (
          <div className="gear-grid">
            <section className="panel wide">
              <div className="section-heading">
                <ShoppingBag size={20} />
                <div>
                  <h2>Habitat Recommendations</h2>
                  <p>Affiliate ideas driven by clip quality, species frequency, and friend performance.</p>
                </div>
              </div>
              <div className="recommendation-grid">
                {recommendations.map((recommendation) => (
                  <article className="recommendation-card" key={recommendation.id}>
                    <img alt={recommendation.title} src={recommendation.imageUrl} />
                    <div>
                      <span>{recommendation.category}</span>
                      <h3>{recommendation.title}</h3>
                      <p>{recommendation.reason}</p>
                    </div>
                    <footer>
                      <strong>{recommendation.price}</strong>
                      <button type="button">
                        {recommendation.matchScore}% match
                        <ChevronRight size={17} />
                      </button>
                    </footer>
                  </article>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="section-heading compact">
                <Settings size={18} />
                <span>Data Signals</span>
              </div>
              <div className="signal-list">
                <Signal label="Best feeder window" value="6:45-8:30 AM" />
                <Signal label="Top attraction" value="Sunflower mix" />
                <Signal label="Missed motion" value="14 clips" />
                <Signal label="Next species target" value="Blue jay" />
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

type MetricProps = {
  icon: typeof Bird;
  label: string;
  value: string;
  tone: "blue" | "gold" | "green" | "coral";
};

function Metric({ icon: Icon, label, value, tone }: MetricProps) {
  return (
    <article className={`metric metric-${tone}`}>
      <span>
        <Icon size={19} />
      </span>
      <div>
        <strong>{value}</strong>
        <p>{label}</p>
      </div>
    </article>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="signal-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;
