import albemarleAnglerFlyTying from "../../assets/images/clubs/albemarleAnglerFlyTying.png";
import albemarleGardenClub from "../../assets/images/clubs/albemarleGardenClub.png";
import centralVirginiaBeeKeepers from "../../assets/images/clubs/centralVirginiaBeeKeepers.png";
import charlottesvilleAreaTrailRunners from "../../assets/images/clubs/charlottesvilleAreaTrailRunners.png";

type Clubs = {
  [city: string]: {
    [category: string]: {
      name: string;
      href: string;
      logo?: string;
    }[];
  };
};

const clubs: Clubs = {
  Charlottesville: {
    Outdoors: [
      {
        name: "Albemarle Angler Fly Tying",
        href: "https://albemarleangler.com/saturday-morning-fly-tying-classes/",
        logo: albemarleAnglerFlyTying,
      },
      {
        name: "Albemarle Garden Club",
        href: "https://www.albemarlegardenclub.com/",
        logo: albemarleGardenClub,
      },
      {
        name: "Central Virginia Bee Keepers",
        href: "https://centralvirginiabeekeepers.org/",
        logo: centralVirginiaBeeKeepers,
      },
      {
        name: "Charlottesville Area Trail Runners",
        href: "https://cvilleareatrailrunners.org/wp/",
        logo: charlottesvilleAreaTrailRunners,
      },
      {
        name: "Charlottesville Area Tree Stewards",
        href: "https://charlottesvilleareatreestewards.org/",
        // logo: Logo,
      },
      {
        name: "Charlottesville Astronomical Society",
        href: "https://cvilleastro.com/",
        // logo: Logo,
      },
      {
        name: "The Charlottesville Garden Club",
        href: "https://www.thecharlottesvillegardenclub.com/",
        // logo: Logo,
      },
      {
        name: "Charlottesville Mycological Society",
        href: "https://www.facebook.com/groups/155717074847942/",
        // logo: Logo,
      },
      {
        name: "GetHiking! Charlottesville",
        href: "https://www.meetup.com/GetHiking-Charlottesville-Charlottesville-VA/",
        // logo: Logo,
      },
      {
        name: "Piedmont Virginia Bird Club",
        href: "https://www.piedmontvirginiabirdclub.org/",
        // logo: Logo,
      },
      {
        name: "Virginia Master Naturalists",
        href: "https://www.vmn-rivanna.org/",
        // logo: Logo,
      },
      {
        name: "Virginia Native Plant Society",
        href: "https://vnps.org/jefferson/",
        // logo: Logo,
      },
    ],
    Sports: [
      { name: "Blue Ridge Disc Golf", href: "http://brdgc.org/" },
      {
        name: "Champion Brewing's Running Club (Paavo's Apostles)",
        href: "https://www.strava.com/clubs/291428",
        // logo: Logo,
      },
      {
        name: "Charlottesville Area Mountain Bike Club",
        href: "http://cambc.org/",
        // logo: Logo,
      },
      {
        name: "Charlottesville Bicycle Club",
        href: "https://www.cvillebikeclub.org/",
        // logo: Logo,
      },
      {
        name: "Charlottesville Cricket Club",
        href: "https://charlottesvillecricket.wordpress.com/about",
        // logo: Logo,
      },
      {
        name: "Charlottesville Derby Dames",
        href: "https://www.charlottesvillederbydames.com/",
        // logo: Logo,
      },
      {
        name: "Charlottesville HEMA (fencing)",
        href: "https://www.charlottesvillehema.org/",
        // logo: Logo,
      },
      {
        name: "Charlottesville Racing Club",
        href: "https://www.cvilleracing.com/",
        // logo: Logo,
      },
      {
        name: "Charlottesville Shotokan Karate Club",
        href: "https://www.cvillekarate.com/",
        // logo: Logo,
      },
      {
        name: "Charlottesville Track Club",
        href: "https://cvilletrackclub.wixsite.com/home",
        // logo: Logo,
      },
      {
        name: "CLAW (Charlottesville Lady Arm Wrestlers)",
        href: "http://www.clawville.org/about-2/",
        // logo: Logo,
      },
      {
        name: "Crossfit Charlottesville",
        href: "https://crossfitcharlottesville.com/charlottesville-strength/",
        // logo: Logo,
      },
      {
        name: "Cville Jiu-Jitsu",
        href: "https://www.cvillebjj.com/",
        // logo: Logo,
      },
      {
        name: "Cville Social Sports Leagues",
        href: "https://cvillesocial.com/leagues",
        // logo: Logo,
      },
      {
        name: "CUDO (Charlottesville Ultimate Disc Organization",
        href: "https://cvilleultimate.org/",
        // logo: Logo,
      },
      {
        name: "Banks Collage Basketball Association",
        href: "https://www.bankscollage.com/about-bcba",
        // logo: Logo,
      },
      {
        name: "Liverpool Football Club Charlottesville",
        href: "https://www.facebook.com/groups/lfccville/",
        // logo: Logo,
      },
      {
        name: "Mountain-Kim Tae Kwon Do",
        href: "http://charlottesvillemartialarts.com/classes/",
        // logo: Logo,
      },
      {
        name: "Parks & Rec's Adult Leagues",
        href: "https://www.charlottesville.gov/283/Adult-Kickball",
        // logo: Logo,
      },
      {
        name: "Prolyfck Run Crew",
        href: "https://www.instagram.com/prolyfyckruncreww/?hl=en",
        // logo: Logo,
      },
      {
        name: "Random Row Run Club",
        href: "https://www.facebook.com/events/744454976354115/",
        // logo: Logo,
      },
      {
        name: "Rocky Top Climbing League",
        href: "https://www.rockytopclimbing.com/climbing-league",
        // logo: Logo,
      },
      {
        name: "Saber Light Knights",
        href: "https://www.saberlightknights.com/",
        // logo: Logo,
      },
      {
        name: "SOCA (Soccer Organization of Charlottesville Area)",
        href: "https://www.socaspot.org/",
        // logo: Logo,
      },
      {
        name: "VRFC (Virginia Rugby Football Club)",
        href: "https://virginiarugby.org/",
        // logo: Logo,
      },
    ],
    Politics: [
      {
        name: "Albemarle County Republican Party",
        href: "https://albemarlegop.org/",
        // logo: Logo,
      },
      { name: "Albemarle Dems", href: "https://albemarledems.org/" },
      {
        name: "Charlottesville BLM",
        href: "https://twitter.com/CvilleBLM",
        // logo: Logo,
      },
      { name: "C'ville Dems", href: "https://cvilledems.org/" },
      {
        name: "Charlottesville Democratic Socialists",
        href: "https://charlottesvilledsa.com/",
        // logo: Logo,
      },
      {
        name: "Charlottesville Low Income Housing Coalition",
        href: "https://affordablehousingcville.org/",
        // logo: Logo,
      },
      {
        name: "Indivisible Cville",
        href: "https://www.indivisiblecharlottesville.org/",
        // logo: Logo,
      },
      {
        name: "SURJ Cville",
        href: "https://www.facebook.com/surjcville/",
        // logo: Logo,
      },
    ],
    Gaming: [
      {
        name: "Charlottesville Chess Club",
        href: "https://www.chess.com/club/charlottesville-chess-club",
        // logo: Logo,
      },
      {
        name: "Dominion Pinball League",
        href: "https://www.facebook.com/groups/dominionpinball/",
        // logo: Logo,
      },
      {
        name: "JMRL Dungeons and Dragons",
        href: "https://www.jmrl.org/calendar.html",
        // logo: Logo,
      },
      {
        name: "The Charlottesville Gaming Club",
        href: "https://www.meetup.com/Charlottesville-Gaming-Group/",
        // logo: Logo,
      },
      {
        name: "he End Games Board Game Community",
        href: "https://www.facebook.com/groups/1680711915490573",
        // logo: Logo,
      },
      {
        name: "The End Games Miniatures Community",
        href: "https://www.facebook.com/groups/1200627169977829",
        // logo: Logo,
      },
      {
        name: "The End Games MTG Community",
        href: "https://www.facebook.com/groups/1006854316019207/",
        // logo: Logo,
      },
      {
        name: "The End Games RPG Community",
        href: "https://www.facebook.com/groups/450942691734021",
        // logo: Logo,
      },
      {
        name: "Zorn Vongal Battle Gaming",
        href: "https://www.instagram.com/zornvongal/?hl=en",
        // logo: Logo,
      },
    ],
    Creative: [
      {
        name: "Blue Ridge Chamber Orchestra",
        href: "https://brco.avenue.org/",
        // logo: Logo,
      },
      {
        name: "Central Virginia Fiber Arts Club",
        href: "https://cvfg.org/",
        // logo: Logo,
      },
      {
        name: "Charlottesville Camera Club",
        href: "http://cvillecameraclub.org/",
        // logo: Logo,
      },
      {
        name: "Charlottesville Municipal Band",
        href: "https://cvilleband.org/wp/",
        // logo: Logo,
      },
      {
        name: "City Clay Night Club",
        href: "http://www.cityclaycville.com/",
        // logo: Logo,
      },
      {
        name: "Charlottesville Players Guild",
        href: "https://jeffschoolheritagecenter.org/about-cpg/",
        // logo: Logo,
      },
      {
        name: "FUCC (Feminist Union of C'ville Creatives)",
        href: "https://www.heyfucc.com/about",
        // logo: Logo,
      },
      {
        name: "Hive Crafting Clubs",
        href: "https://www.facebook.com/thehivecville/",
        // logo: Logo,
      },
      {
        name: "JMRL Book Clubs",
        href: "https://www.jmrl.org/calendar.html",
        // logo: Logo,
      },
      { name: "LiveArts", href: "http://livearts.org/" },
      {
        name: "McGuffey Art Center",
        href: "https://www.mcguffeyartcenter.com/become-a-member",
        // logo: Logo,
      },
      {
        name: "The Oratorio Society",
        href: "https://www.oratoriosociety.org/",
        // logo: Logo,
      },
      {
        name: "Tuesday Design Society",
        href: "https://www.meetup.com/TuesdayDesign/",
        // logo: Logo,
      },
      {
        name: "VA Book Arts",
        href: "https://vabookcenter.org/book-arts/join-us/",
        // logo: Logo,
      },
      { name: "Writer House", href: "http://writerhouse.org/" },
    ],
    Dance: [
      {
        name: "Charlottesville Ballroom",
        href: "https://www.charlottesvilleballroom.com/",
        // logo: Logo,
      },
      {
        name: "Charlottesville Salsa Club",
        href: "https://cvillesalsaclub.com/",
        // logo: Logo,
      },
      {
        name: "Contra Corners",
        href: "https://www.facebook.com/profile.php?id=100064603395126",
        // logo: Logo,
      },
      { name: "Swing Cville", href: "http://swingcville.org/" },
    ],
    "Tech & Business": [
      {
        name: "Boss Babes Cville",
        href: "https://www.facebook.com/groups/1693392564296100",
        // logo: Logo,
      },
      {
        name: "Charlottesville Women in Tech",
        href: "https://www.cvillewomen.tech/",
        // logo: Logo,
      },
      {
        name: "Code for Cville",
        href: "https://www.codeforcville.org/",
        // logo: Logo,
      },
      {
        name: "Minority Business Alliance",
        href: "https://www.cvillechamber.com/mba/",
        // logo: Logo,
      },
      { name: "The Neon Guild", href: "https://www.neonguild.org/" },
      {
        name: "Open Source Recycling",
        href: "https://www.facebook.com/opensourcerecycing",
        // logo: Logo,
      },
    ],
    "Food & Beverage": [
      {
        name: "Astronomy on Tap Charlottesville",
        href: "https://www.facebook.com/aotcville",
        // logo: Logo,
      },
      {
        name: "Charlottesville Area Masters of Real Ale",
        href: "http://www.cvillebrewing.com/",
        // logo: Logo,
      },
      {
        name: "The Whiskey Society",
        href: "https://www.thewhiskeyjarcville.com/whiskey-society",
        // logo: Logo,
      },
    ],
    Historical: [
      {
        name: "Albemarle Charlottesville Historical Society",
        href: "https://albemarlehistory.org/",
        // logo: Logo,
      },
      {
        name: "Burke Brown Steppe African American Genealogical Society",
        href: "https://sites.google.com/site/bbschapterofva/home",
        // logo: Logo,
      },
      {
        name: "Central Virginia Historic Researchers",
        href: "https://www.centralvirginiahistoryresearchers.org/",
        // logo: Logo,
      },
      {
        name: "Preservers of the Daughters of Zion Cemetery",
        href: "https://www.facebook.com/daughtersofzioncemetery/",
        // logo: Logo,
      },
      {
        name: "Veterans Committee of Central Virginia",
        href: "https://vetcommcva.com/",
        // logo: Logo,
      },
    ],
    Miscellaneous: [
      {
        name: "Albemarle Amateur Radio Club",
        href: "https://www.albemarleradio.org/",
        // logo: Logo,
      },
      {
        name: "Blue Ridge PRISM",
        href: "https://blueridgeprism.org/about/",
        // logo: Logo,
      },
      {
        name: "Charlottesville Catholic Dads",
        href: "https://www.facebook.com/groups/1608897239353199",
        // logo: Logo,
      },
      {
        name: "Charlottesville League of Urban Chicken Keepers",
        href: "https://www.facebook.com/groups/64739186014",
        // logo: Logo,
      },
      {
        name: "Charlottesville Modelers Club",
        href: "https://www.cvillemodelersclub.com/",
        // logo: Logo,
      },
      {
        name: "CUFF - Charlottesville Underground Fetish Fellowship",
        href: "https://www.cuff-va.com/",
        // logo: Logo,
      },
      {
        name: "Jefferson Railroad Club",
        href: "https://www.railtalesva.com/newsletter/jefferson/",
        // logo: Logo,
      },
      {
        name: "Meetup Groups",
        href: "https://www.meetup.com/topics/social/us/va/charlottesville/",
        // logo: Logo,
      },
      {
        name: "Piedmont Region Antique Auto Club of America",
        href: "http://clubs.hemmings.com/piedmontregionaaca/?club=piedmontregionaaca",
        // logo: Logo,
      },
    ],
  },
};

export default clubs;
