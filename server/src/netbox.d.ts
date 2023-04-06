declare namespace Netbox {
  export interface NestedCircuit {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Circuit ID */
    cid: string;
  }

  export interface NestedSite {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;
  }

  export interface NestedProviderNetwork {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;
  }

  export interface NestedCable {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Label */
    label?: string;
  }

  export interface CircuitTermination {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    circuit: NestedCircuit;

    /** Termination */
    term_side: "A" | "Z";
    site?: NestedSite;
    provider_network?: NestedProviderNetwork;

    /**
     * Port speed (Kbps)
     * @min 0
     * @max 2147483647
     */
    port_speed?: number | null;

    /**
     * Upstream speed (Kbps)
     * Upstream speed, if different from port speed
     * @min 0
     * @max 2147483647
     */
    upstream_speed?: number | null;

    /** Cross-connect ID */
    xconnect_id?: string;

    /** Patch panel/port(s) */
    pp_info?: string;

    /** Description */
    description?: string;

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;

    /** occupied */
    _occupied?: boolean;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableCircuitTermination {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Circuit */
    circuit: number;

    /** Termination */
    term_side: "A" | "Z";

    /** Site */
    site?: number | null;

    /** Provider network */
    provider_network?: number | null;

    /**
     * Port speed (Kbps)
     * @min 0
     * @max 2147483647
     */
    port_speed?: number | null;

    /**
     * Upstream speed (Kbps)
     * Upstream speed, if different from port speed
     * @min 0
     * @max 2147483647
     */
    upstream_speed?: number | null;

    /** Cross-connect ID */
    xconnect_id?: string;

    /** Patch panel/port(s) */
    pp_info?: string;

    /** Description */
    description?: string;

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;

    /** occupied */
    _occupied?: boolean;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface NestedTag {
    /** Id */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /**
     * Color
     * @pattern ^[0-9a-f]{6}$
     */
    color?: string;
  }

  export interface CircuitType {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Circuit count */
    circuit_count?: number;
  }

  export interface NestedProvider {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Circuit count */
    circuit_count?: number;
  }

  export interface NestedCircuitType {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Circuit count */
    circuit_count?: number;
  }

  export interface NestedTenant {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;
  }

  export interface CircuitCircuitTermination {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    site: NestedSite;
    provider_network: NestedProviderNetwork;

    /**
     * Port speed (Kbps)
     * @min 0
     * @max 2147483647
     */
    port_speed?: number | null;

    /**
     * Upstream speed (Kbps)
     * Upstream speed, if different from port speed
     * @min 0
     * @max 2147483647
     */
    upstream_speed?: number | null;

    /** Cross-connect ID */
    xconnect_id?: string;
  }

  export interface Circuit {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Circuit ID */
    cid: string;
    provider: NestedProvider;
    type: NestedCircuitType;

    /** Status */
    status?: {
      label:
        | "Planned"
        | "Provisioning"
        | "Active"
        | "Offline"
        | "Deprovisioning"
        | "Decommissioned";
      value:
        | "planned"
        | "provisioning"
        | "active"
        | "offline"
        | "deprovisioning"
        | "decommissioned";
    };
    tenant?: NestedTenant;

    /**
     * Date installed
     * @format date
     */
    install_date?: string | null;

    /**
     * Commit rate (Kbps)
     * @min 0
     * @max 2147483647
     */
    commit_rate?: number | null;

    /** Description */
    description?: string;
    termination_a?: CircuitCircuitTermination;
    termination_z?: CircuitCircuitTermination;

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableCircuit {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Circuit ID */
    cid: string;

    /** Provider */
    provider: number;

    /** Type */
    type: number;

    /** Status */
    status?:
      | "planned"
      | "provisioning"
      | "active"
      | "offline"
      | "deprovisioning"
      | "decommissioned";

    /** Tenant */
    tenant?: number | null;

    /**
     * Date installed
     * @format date
     */
    install_date?: string | null;

    /**
     * Commit rate (Kbps)
     * @min 0
     * @max 2147483647
     */
    commit_rate?: number | null;

    /** Description */
    description?: string;

    /** Termination a */
    termination_a?: number;

    /** Termination z */
    termination_z?: number;

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface ProviderNetwork {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    provider: NestedProvider;

    /** Name */
    name: string;

    /** Service ID */
    service_id?: string;

    /** Description */
    description?: string;

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableProviderNetwork {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Provider */
    provider: number;

    /** Name */
    name: string;

    /** Service ID */
    service_id?: string;

    /** Description */
    description?: string;

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface NestedASN {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /**
     * ASN
     * 32-bit autonomous system number
     * @min 1
     * @max 4294967295
     */
    asn: number;
  }

  export interface Provider {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /**
     * ASN
     * 32-bit autonomous system number
     * @min 1
     * @max 4294967295
     */
    asn?: number | null;

    /** Account number */
    account?: string;

    /**
     * Portal URL
     * @format uri
     */
    portal_url?: string;

    /** NOC contact */
    noc_contact?: string;

    /** Admin contact */
    admin_contact?: string;

    /** Comments */
    comments?: string;
    asns?: NestedASN[];
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Circuit count */
    circuit_count?: number;
  }

  export interface WritableProvider {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /**
     * ASN
     * 32-bit autonomous system number
     * @min 1
     * @max 4294967295
     */
    asn?: number | null;

    /** Account number */
    account?: string;

    /**
     * Portal URL
     * @format uri
     */
    portal_url?: string;

    /** NOC contact */
    noc_contact?: string;

    /** Admin contact */
    admin_contact?: string;

    /** Comments */
    comments?: string;
    asns?: number[];
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Circuit count */
    circuit_count?: number;
  }

  export interface Cable {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Termination a type */
    termination_a_type: string;

    /**
     * Termination a id
     * @min 0
     * @max 9223372036854776000
     */
    termination_a_id: number;

    /** Termination a */
    termination_a?: Record<string, string | null>;

    /** Termination b type */
    termination_b_type: string;

    /**
     * Termination b id
     * @min 0
     * @max 9223372036854776000
     */
    termination_b_id: number;

    /** Termination b */
    termination_b?: Record<string, string | null>;

    /** Type */
    type?:
      | "cat3"
      | "cat5"
      | "cat5e"
      | "cat6"
      | "cat6a"
      | "cat7"
      | "cat7a"
      | "cat8"
      | "dac-active"
      | "dac-passive"
      | "mrj21-trunk"
      | "coaxial"
      | "mmf"
      | "mmf-om1"
      | "mmf-om2"
      | "mmf-om3"
      | "mmf-om4"
      | "mmf-om5"
      | "smf"
      | "smf-os1"
      | "smf-os2"
      | "aoc"
      | "power";

    /** Status */
    status?: {
      label: "Connected" | "Planned" | "Decommissioning";
      value: "connected" | "planned" | "decommissioning";
    };
    tenant?: NestedTenant;

    /** Label */
    label?: string;

    /**
     * Color
     * @pattern ^[0-9a-f]{6}$
     */
    color?: string;

    /**
     * Length
     * @format decimal
     */
    length?: number | null;

    /** Length unit */
    length_unit?: {
      label:
        | "Kilometers"
        | "Meters"
        | "Centimeters"
        | "Miles"
        | "Feet"
        | "Inches";
      value: "km" | "m" | "cm" | "mi" | "ft" | "in";
    };
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableCable {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Termination a type */
    termination_a_type: string;

    /**
     * Termination a id
     * @min 0
     * @max 9223372036854776000
     */
    termination_a_id: number;

    /** Termination a */
    termination_a?: Record<string, string | null>;

    /** Termination b type */
    termination_b_type: string;

    /**
     * Termination b id
     * @min 0
     * @max 9223372036854776000
     */
    termination_b_id: number;

    /** Termination b */
    termination_b?: Record<string, string | null>;

    /** Type */
    type?:
      | "cat3"
      | "cat5"
      | "cat5e"
      | "cat6"
      | "cat6a"
      | "cat7"
      | "cat7a"
      | "cat8"
      | "dac-active"
      | "dac-passive"
      | "mrj21-trunk"
      | "coaxial"
      | "mmf"
      | "mmf-om1"
      | "mmf-om2"
      | "mmf-om3"
      | "mmf-om4"
      | "mmf-om5"
      | "smf"
      | "smf-os1"
      | "smf-os2"
      | "aoc"
      | "power";

    /** Status */
    status?: "connected" | "planned" | "decommissioning";

    /** Tenant */
    tenant?: number | null;

    /** Label */
    label?: string;

    /**
     * Color
     * @pattern ^[0-9a-f]{6}$
     */
    color?: string;

    /**
     * Length
     * @format decimal
     */
    length?: number | null;

    /** Length unit */
    length_unit?: "km" | "m" | "cm" | "mi" | "ft" | "in";
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface NestedManufacturer {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Devicetype count */
    devicetype_count?: number;
  }

  export interface NestedDeviceType {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    manufacturer?: NestedManufacturer;

    /** Model */
    model: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Device count */
    device_count?: number;
  }

  export interface NestedDeviceRole {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Device count */
    device_count?: number;

    /** Virtualmachine count */
    virtualmachine_count?: number;
  }

  export interface NestedPlatform {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Device count */
    device_count?: number;

    /** Virtualmachine count */
    virtualmachine_count?: number;
  }

  export interface NestedLocation {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Rack count */
    rack_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface NestedRack {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /** Device count */
    device_count?: number;
  }

  export interface NestedDevice {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name?: string | null;
  }

  export interface NestedIPAddress {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Family */
    family?: number;

    /**
     * Address
     * IPv4 or IPv6 address (with mask)
     */
    address: string;
  }

  export interface NestedCluster {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /** Virtualmachine count */
    virtualmachine_count?: number;
  }

  export interface NestedVirtualChassis {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;
    master: NestedDevice;

    /** Member count */
    member_count?: number;
  }

  export interface Device {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name?: string | null;
    device_type: NestedDeviceType;
    device_role: NestedDeviceRole;
    tenant?: NestedTenant;
    platform?: NestedPlatform;

    /** Serial number */
    serial?: string;

    /**
     * Asset tag
     * A unique tag used to identify this device
     */
    asset_tag?: string | null;
    site: NestedSite;
    location?: NestedLocation;
    rack?: NestedRack;

    /**
     * Position (U)
     * @min 1
     */
    position?: number | null;

    /** Face */
    face?: { label: "Front" | "Rear"; value: "front" | "rear" };
    parent_device?: NestedDevice;

    /** Status */
    status?: {
      label:
        | "Offline"
        | "Active"
        | "Planned"
        | "Staged"
        | "Failed"
        | "Inventory"
        | "Decommissioning";
      value:
        | "offline"
        | "active"
        | "planned"
        | "staged"
        | "failed"
        | "inventory"
        | "decommissioning";
    };

    /** Airflow */
    airflow?: {
      label:
        | "Front to rear"
        | "Rear to front"
        | "Left to right"
        | "Right to left"
        | "Side to rear"
        | "Passive"
        | "Mixed";
      value:
        | "front-to-rear"
        | "rear-to-front"
        | "left-to-right"
        | "right-to-left"
        | "side-to-rear"
        | "passive"
        | "mixed";
    };
    primary_ip?: NestedIPAddress;
    primary_ip4?: NestedIPAddress;
    primary_ip6?: NestedIPAddress;
    cluster?: NestedCluster;
    virtual_chassis?: NestedVirtualChassis;

    /**
     * Vc position
     * @min 0
     * @max 255
     */
    vc_position?: number | null;

    /**
     * Vc priority
     * @min 0
     * @max 255
     */
    vc_priority?: number | null;

    /** Comments */
    comments?: string;

    /** Local context data */
    local_context_data?: string | null;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface NestedModuleType {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    manufacturer?: NestedManufacturer;

    /** Model */
    model: string;
  }

  export interface ConsolePortTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device_type?: NestedDeviceType;
    module_type?: NestedModuleType;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type?: {
      label:
        | "DE-9"
        | "DB-25"
        | "RJ-11"
        | "RJ-12"
        | "RJ-45"
        | "Mini-DIN 8"
        | "USB Type A"
        | "USB Type B"
        | "USB Type C"
        | "USB Mini A"
        | "USB Mini B"
        | "USB Micro A"
        | "USB Micro B"
        | "USB Micro AB"
        | "Other";
      value:
        | "de-9"
        | "db-25"
        | "rj-11"
        | "rj-12"
        | "rj-45"
        | "mini-din-8"
        | "usb-a"
        | "usb-b"
        | "usb-c"
        | "usb-mini-a"
        | "usb-mini-b"
        | "usb-micro-a"
        | "usb-micro-b"
        | "usb-micro-ab"
        | "other";
    };

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableConsolePortTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device type */
    device_type?: number | null;

    /** Module type */
    module_type?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type?:
      | "de-9"
      | "db-25"
      | "rj-11"
      | "rj-12"
      | "rj-45"
      | "mini-din-8"
      | "usb-a"
      | "usb-b"
      | "usb-c"
      | "usb-mini-a"
      | "usb-mini-b"
      | "usb-micro-a"
      | "usb-micro-b"
      | "usb-micro-ab"
      | "other";

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface ModuleNestedModuleBay {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;
  }

  export interface ComponentNestedModule {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device */
    device: number;
    module_bay?: ModuleNestedModuleBay;
  }

  export interface ConsolePort {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device: NestedDevice;
    module?: ComponentNestedModule;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type?: {
      label:
        | "DE-9"
        | "DB-25"
        | "RJ-11"
        | "RJ-12"
        | "RJ-45"
        | "Mini-DIN 8"
        | "USB Type A"
        | "USB Type B"
        | "USB Type C"
        | "USB Mini A"
        | "USB Mini B"
        | "USB Micro A"
        | "USB Micro B"
        | "USB Micro AB"
        | "Other";
      value:
        | "de-9"
        | "db-25"
        | "rj-11"
        | "rj-12"
        | "rj-45"
        | "mini-din-8"
        | "usb-a"
        | "usb-b"
        | "usb-c"
        | "usb-mini-a"
        | "usb-mini-b"
        | "usb-micro-a"
        | "usb-micro-b"
        | "usb-micro-ab"
        | "other";
    };

    /** Speed */
    speed?: {
      label:
        | "1200 bps"
        | "2400 bps"
        | "4800 bps"
        | "9600 bps"
        | "19.2 kbps"
        | "38.4 kbps"
        | "57.6 kbps"
        | "115.2 kbps";
      value: 1200 | 2400 | 4800 | 9600 | 19200 | 38400 | 57600 | 115200;
    };

    /** Description */
    description?: string;

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;

    /**
     * Connected endpoint
     *
     * Return the appropriate serializer for the type of connected object.
     */
    connected_endpoint?: Record<string, string | null>;

    /** Connected endpoint type */
    connected_endpoint_type?: string;

    /** Connected endpoint reachable */
    connected_endpoint_reachable?: boolean;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** occupied */
    _occupied?: boolean;
  }

  export interface WritableConsolePort {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device */
    device: number;

    /** Module */
    module?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /**
     * Type
     * Physical port type
     */
    type?:
      | "de-9"
      | "db-25"
      | "rj-11"
      | "rj-12"
      | "rj-45"
      | "mini-din-8"
      | "usb-a"
      | "usb-b"
      | "usb-c"
      | "usb-mini-a"
      | "usb-mini-b"
      | "usb-micro-a"
      | "usb-micro-b"
      | "usb-micro-ab"
      | "other";

    /**
     * Speed
     * Port speed in bits per second
     */
    speed?:
      | "1200"
      | "2400"
      | "4800"
      | "9600"
      | "19200"
      | "38400"
      | "57600"
      | "115200"
      | null;

    /** Description */
    description?: string;

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;

    /**
     * Connected endpoint
     *
     * Return the appropriate serializer for the type of connected object.
     */
    connected_endpoint?: Record<string, string | null>;

    /** Connected endpoint type */
    connected_endpoint_type?: string;

    /** Connected endpoint reachable */
    connected_endpoint_reachable?: boolean;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** occupied */
    _occupied?: boolean;
  }

  export interface ConsoleServerPortTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device_type?: NestedDeviceType;
    module_type?: NestedModuleType;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type?: {
      label:
        | "DE-9"
        | "DB-25"
        | "RJ-11"
        | "RJ-12"
        | "RJ-45"
        | "Mini-DIN 8"
        | "USB Type A"
        | "USB Type B"
        | "USB Type C"
        | "USB Mini A"
        | "USB Mini B"
        | "USB Micro A"
        | "USB Micro B"
        | "USB Micro AB"
        | "Other";
      value:
        | "de-9"
        | "db-25"
        | "rj-11"
        | "rj-12"
        | "rj-45"
        | "mini-din-8"
        | "usb-a"
        | "usb-b"
        | "usb-c"
        | "usb-mini-a"
        | "usb-mini-b"
        | "usb-micro-a"
        | "usb-micro-b"
        | "usb-micro-ab"
        | "other";
    };

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableConsoleServerPortTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device type */
    device_type?: number | null;

    /** Module type */
    module_type?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type?:
      | "de-9"
      | "db-25"
      | "rj-11"
      | "rj-12"
      | "rj-45"
      | "mini-din-8"
      | "usb-a"
      | "usb-b"
      | "usb-c"
      | "usb-mini-a"
      | "usb-mini-b"
      | "usb-micro-a"
      | "usb-micro-b"
      | "usb-micro-ab"
      | "other";

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface ConsoleServerPort {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device: NestedDevice;
    module?: ComponentNestedModule;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type?: {
      label:
        | "DE-9"
        | "DB-25"
        | "RJ-11"
        | "RJ-12"
        | "RJ-45"
        | "Mini-DIN 8"
        | "USB Type A"
        | "USB Type B"
        | "USB Type C"
        | "USB Mini A"
        | "USB Mini B"
        | "USB Micro A"
        | "USB Micro B"
        | "USB Micro AB"
        | "Other";
      value:
        | "de-9"
        | "db-25"
        | "rj-11"
        | "rj-12"
        | "rj-45"
        | "mini-din-8"
        | "usb-a"
        | "usb-b"
        | "usb-c"
        | "usb-mini-a"
        | "usb-mini-b"
        | "usb-micro-a"
        | "usb-micro-b"
        | "usb-micro-ab"
        | "other";
    };

    /** Speed */
    speed?: {
      label:
        | "1200 bps"
        | "2400 bps"
        | "4800 bps"
        | "9600 bps"
        | "19.2 kbps"
        | "38.4 kbps"
        | "57.6 kbps"
        | "115.2 kbps";
      value: 1200 | 2400 | 4800 | 9600 | 19200 | 38400 | 57600 | 115200;
    };

    /** Description */
    description?: string;

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;

    /**
     * Connected endpoint
     *
     * Return the appropriate serializer for the type of connected object.
     */
    connected_endpoint?: Record<string, string | null>;

    /** Connected endpoint type */
    connected_endpoint_type?: string;

    /** Connected endpoint reachable */
    connected_endpoint_reachable?: boolean;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** occupied */
    _occupied?: boolean;
  }

  export interface WritableConsoleServerPort {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device */
    device: number;

    /** Module */
    module?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /**
     * Type
     * Physical port type
     */
    type?:
      | "de-9"
      | "db-25"
      | "rj-11"
      | "rj-12"
      | "rj-45"
      | "mini-din-8"
      | "usb-a"
      | "usb-b"
      | "usb-c"
      | "usb-mini-a"
      | "usb-mini-b"
      | "usb-micro-a"
      | "usb-micro-b"
      | "usb-micro-ab"
      | "other";

    /**
     * Speed
     * Port speed in bits per second
     */
    speed?:
      | "1200"
      | "2400"
      | "4800"
      | "9600"
      | "19200"
      | "38400"
      | "57600"
      | "115200"
      | null;

    /** Description */
    description?: string;

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;

    /**
     * Connected endpoint
     *
     * Return the appropriate serializer for the type of connected object.
     */
    connected_endpoint?: Record<string, string | null>;

    /** Connected endpoint type */
    connected_endpoint_type?: string;

    /** Connected endpoint reachable */
    connected_endpoint_reachable?: boolean;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** occupied */
    _occupied?: boolean;
  }

  export interface DeviceBayTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device_type: NestedDeviceType;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableDeviceBayTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device type */
    device_type: number;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface DeviceBay {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device: NestedDevice;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Description */
    description?: string;
    installed_device?: NestedDevice;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableDeviceBay {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device */
    device: number;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Description */
    description?: string;

    /** Installed device */
    installed_device?: number | null;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface DeviceRole {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /**
     * Color
     * @pattern ^[0-9a-f]{6}$
     */
    color?: string;

    /**
     * VM Role
     * Virtual machines may be assigned to this role
     */
    vm_role?: boolean;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Device count */
    device_count?: number;

    /** Virtualmachine count */
    virtualmachine_count?: number;
  }

  export interface DeviceType {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    manufacturer: NestedManufacturer;

    /** Model */
    model: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /**
     * Part number
     * Discrete part number (optional)
     */
    part_number?: string;

    /**
     * Height (U)
     * @min 0
     * @max 32767
     */
    u_height?: number;

    /**
     * Is full depth
     * Device consumes both front and rear rack faces
     */
    is_full_depth?: boolean;

    /** Subdevice role */
    subdevice_role?: { label: "Parent" | "Child"; value: "parent" | "child" };

    /** Airflow */
    airflow?: {
      label:
        | "Front to rear"
        | "Rear to front"
        | "Left to right"
        | "Right to left"
        | "Side to rear"
        | "Passive"
        | "Mixed";
      value:
        | "front-to-rear"
        | "rear-to-front"
        | "left-to-right"
        | "right-to-left"
        | "side-to-rear"
        | "passive"
        | "mixed";
    };

    /**
     * Front image
     * @format uri
     */
    front_image?: string;

    /**
     * Rear image
     * @format uri
     */
    rear_image?: string;

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Device count */
    device_count?: number;
  }

  export interface WritableDeviceType {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Manufacturer */
    manufacturer: number;

    /** Model */
    model: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /**
     * Part number
     * Discrete part number (optional)
     */
    part_number?: string;

    /**
     * Height (U)
     * @min 0
     * @max 32767
     */
    u_height?: number;

    /**
     * Is full depth
     * Device consumes both front and rear rack faces
     */
    is_full_depth?: boolean;

    /**
     * Parent/child status
     * Parent devices house child devices in device bays. Leave blank if this device type is neither a parent nor a child.
     */
    subdevice_role?: "parent" | "child";

    /** Airflow */
    airflow?:
      | "front-to-rear"
      | "rear-to-front"
      | "left-to-right"
      | "right-to-left"
      | "side-to-rear"
      | "passive"
      | "mixed";

    /**
     * Front image
     * @format uri
     */
    front_image?: string;

    /**
     * Rear image
     * @format uri
     */
    rear_image?: string;

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Device count */
    device_count?: number;
  }

  export interface DeviceWithConfigContext {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name?: string | null;
    device_type: NestedDeviceType;
    device_role: NestedDeviceRole;
    tenant?: NestedTenant;
    platform?: NestedPlatform;

    /** Serial number */
    serial?: string;

    /**
     * Asset tag
     * A unique tag used to identify this device
     */
    asset_tag?: string | null;
    site: NestedSite;
    location?: NestedLocation;
    rack?: NestedRack;

    /**
     * Position (U)
     * @min 1
     */
    position?: number | null;

    /** Face */
    face?: { label: "Front" | "Rear"; value: "front" | "rear" };
    parent_device?: NestedDevice;

    /** Status */
    status?: {
      label:
        | "Offline"
        | "Active"
        | "Planned"
        | "Staged"
        | "Failed"
        | "Inventory"
        | "Decommissioning";
      value:
        | "offline"
        | "active"
        | "planned"
        | "staged"
        | "failed"
        | "inventory"
        | "decommissioning";
    };

    /** Airflow */
    airflow?: {
      label:
        | "Front to rear"
        | "Rear to front"
        | "Left to right"
        | "Right to left"
        | "Side to rear"
        | "Passive"
        | "Mixed";
      value:
        | "front-to-rear"
        | "rear-to-front"
        | "left-to-right"
        | "right-to-left"
        | "side-to-rear"
        | "passive"
        | "mixed";
    };
    primary_ip?: NestedIPAddress;
    primary_ip4?: NestedIPAddress;
    primary_ip6?: NestedIPAddress;
    cluster?: NestedCluster;
    virtual_chassis?: NestedVirtualChassis;

    /**
     * Vc position
     * @min 0
     * @max 255
     */
    vc_position?: number | null;

    /**
     * Vc priority
     * @min 0
     * @max 255
     */
    vc_priority?: number | null;

    /** Comments */
    comments?: string;

    /** Local context data */
    local_context_data?: string | null;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /** Config context */
    config_context?: Record<string, string | null>;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableDeviceWithConfigContext {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name?: string | null;

    /** Device type */
    device_type: number;

    /** Device role */
    device_role: number;

    /** Tenant */
    tenant?: number | null;

    /** Platform */
    platform?: number | null;

    /** Serial number */
    serial?: string;

    /**
     * Asset tag
     * A unique tag used to identify this device
     */
    asset_tag?: string | null;

    /** Site */
    site: number;

    /** Location */
    location?: number | null;

    /** Rack */
    rack?: number | null;

    /**
     * Position (U)
     * @min 1
     */
    position?: number | null;

    /** Rack face */
    face: "front" | "rear";
    parent_device?: NestedDevice;

    /** Status */
    status?:
      | "offline"
      | "active"
      | "planned"
      | "staged"
      | "failed"
      | "inventory"
      | "decommissioning";

    /** Airflow */
    airflow?:
      | "front-to-rear"
      | "rear-to-front"
      | "left-to-right"
      | "right-to-left"
      | "side-to-rear"
      | "passive"
      | "mixed";

    /** Primary ip */
    primary_ip?: string;

    /** Primary IPv4 */
    primary_ip4?: number | null;

    /** Primary IPv6 */
    primary_ip6?: number | null;

    /** Cluster */
    cluster?: number | null;

    /** Virtual chassis */
    virtual_chassis?: number | null;

    /**
     * Vc position
     * @min 0
     * @max 255
     */
    vc_position?: number | null;

    /**
     * Vc priority
     * @min 0
     * @max 255
     */
    vc_priority?: number | null;

    /** Comments */
    comments?: string;

    /** Local context data */
    local_context_data?: string | null;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /** Config context */
    config_context?: Record<string, string | null>;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface DeviceNAPALM {
    /** Method */
    method: Record<string, string | null>;
  }

  export interface NestedRearPortTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;
  }

  export interface FrontPortTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device_type?: NestedDeviceType;
    module_type?: NestedModuleType;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type: {
      label:
        | "8P8C"
        | "8P6C"
        | "8P4C"
        | "8P2C"
        | "6P6C"
        | "6P4C"
        | "6P2C"
        | "4P4C"
        | "4P2C"
        | "GG45"
        | "TERA 4P"
        | "TERA 2P"
        | "TERA 1P"
        | "110 Punch"
        | "BNC"
        | "F Connector"
        | "N Connector"
        | "MRJ21"
        | "FC"
        | "LC"
        | "LC/PC"
        | "LC/UPC"
        | "LC/APC"
        | "LSH"
        | "LSH/PC"
        | "LSH/UPC"
        | "LSH/APC"
        | "MPO"
        | "MTRJ"
        | "SC"
        | "SC/PC"
        | "SC/UPC"
        | "SC/APC"
        | "ST"
        | "CS"
        | "SN"
        | "SMA 905"
        | "SMA 906"
        | "URM-P2"
        | "URM-P4"
        | "URM-P8"
        | "Splice"
        | "Other";
      value:
        | "8p8c"
        | "8p6c"
        | "8p4c"
        | "8p2c"
        | "6p6c"
        | "6p4c"
        | "6p2c"
        | "4p4c"
        | "4p2c"
        | "gg45"
        | "tera-4p"
        | "tera-2p"
        | "tera-1p"
        | "110-punch"
        | "bnc"
        | "f"
        | "n"
        | "mrj21"
        | "fc"
        | "lc"
        | "lc-pc"
        | "lc-upc"
        | "lc-apc"
        | "lsh"
        | "lsh-pc"
        | "lsh-upc"
        | "lsh-apc"
        | "mpo"
        | "mtrj"
        | "sc"
        | "sc-pc"
        | "sc-upc"
        | "sc-apc"
        | "st"
        | "cs"
        | "sn"
        | "sma-905"
        | "sma-906"
        | "urm-p2"
        | "urm-p4"
        | "urm-p8"
        | "splice"
        | "other";
    };

    /**
     * Color
     * @pattern ^[0-9a-f]{6}$
     */
    color?: string;
    rear_port: NestedRearPortTemplate;

    /**
     * Rear port position
     * @min 1
     * @max 1024
     */
    rear_port_position?: number;

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableFrontPortTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device type */
    device_type?: number | null;

    /** Module type */
    module_type?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type:
      | "8p8c"
      | "8p6c"
      | "8p4c"
      | "8p2c"
      | "6p6c"
      | "6p4c"
      | "6p2c"
      | "4p4c"
      | "4p2c"
      | "gg45"
      | "tera-4p"
      | "tera-2p"
      | "tera-1p"
      | "110-punch"
      | "bnc"
      | "f"
      | "n"
      | "mrj21"
      | "fc"
      | "lc"
      | "lc-pc"
      | "lc-upc"
      | "lc-apc"
      | "lsh"
      | "lsh-pc"
      | "lsh-upc"
      | "lsh-apc"
      | "mpo"
      | "mtrj"
      | "sc"
      | "sc-pc"
      | "sc-upc"
      | "sc-apc"
      | "st"
      | "cs"
      | "sn"
      | "sma-905"
      | "sma-906"
      | "urm-p2"
      | "urm-p4"
      | "urm-p8"
      | "splice"
      | "other";

    /**
     * Color
     * @pattern ^[0-9a-f]{6}$
     */
    color?: string;

    /** Rear port */
    rear_port: number;

    /**
     * Rear port position
     * @min 1
     * @max 1024
     */
    rear_port_position?: number;

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface FrontPortRearPort {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;
  }

  export interface FrontPort {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device: NestedDevice;
    module?: ComponentNestedModule;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type: {
      label:
        | "8P8C"
        | "8P6C"
        | "8P4C"
        | "8P2C"
        | "6P6C"
        | "6P4C"
        | "6P2C"
        | "4P4C"
        | "4P2C"
        | "GG45"
        | "TERA 4P"
        | "TERA 2P"
        | "TERA 1P"
        | "110 Punch"
        | "BNC"
        | "F Connector"
        | "N Connector"
        | "MRJ21"
        | "FC"
        | "LC"
        | "LC/PC"
        | "LC/UPC"
        | "LC/APC"
        | "LSH"
        | "LSH/PC"
        | "LSH/UPC"
        | "LSH/APC"
        | "MPO"
        | "MTRJ"
        | "SC"
        | "SC/PC"
        | "SC/UPC"
        | "SC/APC"
        | "ST"
        | "CS"
        | "SN"
        | "SMA 905"
        | "SMA 906"
        | "URM-P2"
        | "URM-P4"
        | "URM-P8"
        | "Splice"
        | "Other";
      value:
        | "8p8c"
        | "8p6c"
        | "8p4c"
        | "8p2c"
        | "6p6c"
        | "6p4c"
        | "6p2c"
        | "4p4c"
        | "4p2c"
        | "gg45"
        | "tera-4p"
        | "tera-2p"
        | "tera-1p"
        | "110-punch"
        | "bnc"
        | "f"
        | "n"
        | "mrj21"
        | "fc"
        | "lc"
        | "lc-pc"
        | "lc-upc"
        | "lc-apc"
        | "lsh"
        | "lsh-pc"
        | "lsh-upc"
        | "lsh-apc"
        | "mpo"
        | "mtrj"
        | "sc"
        | "sc-pc"
        | "sc-upc"
        | "sc-apc"
        | "st"
        | "cs"
        | "sn"
        | "sma-905"
        | "sma-906"
        | "urm-p2"
        | "urm-p4"
        | "urm-p8"
        | "splice"
        | "other";
    };

    /**
     * Color
     * @pattern ^[0-9a-f]{6}$
     */
    color?: string;
    rear_port: FrontPortRearPort;

    /**
     * Rear port position
     * @min 1
     * @max 1024
     */
    rear_port_position?: number;

    /** Description */
    description?: string;

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** occupied */
    _occupied?: boolean;
  }

  export interface WritableFrontPort {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device */
    device: number;

    /** Module */
    module?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type:
      | "8p8c"
      | "8p6c"
      | "8p4c"
      | "8p2c"
      | "6p6c"
      | "6p4c"
      | "6p2c"
      | "4p4c"
      | "4p2c"
      | "gg45"
      | "tera-4p"
      | "tera-2p"
      | "tera-1p"
      | "110-punch"
      | "bnc"
      | "f"
      | "n"
      | "mrj21"
      | "fc"
      | "lc"
      | "lc-pc"
      | "lc-upc"
      | "lc-apc"
      | "lsh"
      | "lsh-pc"
      | "lsh-upc"
      | "lsh-apc"
      | "mpo"
      | "mtrj"
      | "sc"
      | "sc-pc"
      | "sc-upc"
      | "sc-apc"
      | "st"
      | "cs"
      | "sn"
      | "sma-905"
      | "sma-906"
      | "urm-p2"
      | "urm-p4"
      | "urm-p8"
      | "splice"
      | "other";

    /**
     * Color
     * @pattern ^[0-9a-f]{6}$
     */
    color?: string;

    /** Rear port */
    rear_port: number;

    /**
     * Rear port position
     * @min 1
     * @max 1024
     */
    rear_port_position?: number;

    /** Description */
    description?: string;

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** occupied */
    _occupied?: boolean;
  }

  export interface InterfaceTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device_type?: NestedDeviceType;
    module_type?: NestedModuleType;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type: {
      label:
        | "Virtual"
        | "Bridge"
        | "Link Aggregation Group (LAG)"
        | "100BASE-TX (10/100ME)"
        | "1000BASE-T (1GE)"
        | "2.5GBASE-T (2.5GE)"
        | "5GBASE-T (5GE)"
        | "10GBASE-T (10GE)"
        | "10GBASE-CX4 (10GE)"
        | "GBIC (1GE)"
        | "SFP (1GE)"
        | "SFP+ (10GE)"
        | "XFP (10GE)"
        | "XENPAK (10GE)"
        | "X2 (10GE)"
        | "SFP28 (25GE)"
        | "SFP56 (50GE)"
        | "QSFP+ (40GE)"
        | "QSFP28 (50GE)"
        | "CFP (100GE)"
        | "CFP2 (100GE)"
        | "CFP2 (200GE)"
        | "CFP4 (100GE)"
        | "Cisco CPAK (100GE)"
        | "QSFP28 (100GE)"
        | "QSFP56 (200GE)"
        | "QSFP-DD (400GE)"
        | "OSFP (400GE)"
        | "IEEE 802.11a"
        | "IEEE 802.11b/g"
        | "IEEE 802.11n"
        | "IEEE 802.11ac"
        | "IEEE 802.11ad"
        | "IEEE 802.11ax"
        | "IEEE 802.15.1 (Bluetooth)"
        | "GSM"
        | "CDMA"
        | "LTE"
        | "OC-3/STM-1"
        | "OC-12/STM-4"
        | "OC-48/STM-16"
        | "OC-192/STM-64"
        | "OC-768/STM-256"
        | "OC-1920/STM-640"
        | "OC-3840/STM-1234"
        | "SFP (1GFC)"
        | "SFP (2GFC)"
        | "SFP (4GFC)"
        | "SFP+ (8GFC)"
        | "SFP+ (16GFC)"
        | "SFP28 (32GFC)"
        | "QSFP+ (64GFC)"
        | "QSFP28 (128GFC)"
        | "SDR (2 Gbps)"
        | "DDR (4 Gbps)"
        | "QDR (8 Gbps)"
        | "FDR10 (10 Gbps)"
        | "FDR (13.5 Gbps)"
        | "EDR (25 Gbps)"
        | "HDR (50 Gbps)"
        | "NDR (100 Gbps)"
        | "XDR (250 Gbps)"
        | "T1 (1.544 Mbps)"
        | "E1 (2.048 Mbps)"
        | "T3 (45 Mbps)"
        | "E3 (34 Mbps)"
        | "xDSL"
        | "Cisco StackWise"
        | "Cisco StackWise Plus"
        | "Cisco FlexStack"
        | "Cisco FlexStack Plus"
        | "Cisco StackWise-80"
        | "Cisco StackWise-160"
        | "Cisco StackWise-320"
        | "Cisco StackWise-480"
        | "Juniper VCP"
        | "Extreme SummitStack"
        | "Extreme SummitStack-128"
        | "Extreme SummitStack-256"
        | "Extreme SummitStack-512"
        | "Other";
      value:
        | "virtual"
        | "bridge"
        | "lag"
        | "100base-tx"
        | "1000base-t"
        | "2.5gbase-t"
        | "5gbase-t"
        | "10gbase-t"
        | "10gbase-cx4"
        | "1000base-x-gbic"
        | "1000base-x-sfp"
        | "10gbase-x-sfpp"
        | "10gbase-x-xfp"
        | "10gbase-x-xenpak"
        | "10gbase-x-x2"
        | "25gbase-x-sfp28"
        | "50gbase-x-sfp56"
        | "40gbase-x-qsfpp"
        | "50gbase-x-sfp28"
        | "100gbase-x-cfp"
        | "100gbase-x-cfp2"
        | "200gbase-x-cfp2"
        | "100gbase-x-cfp4"
        | "100gbase-x-cpak"
        | "100gbase-x-qsfp28"
        | "200gbase-x-qsfp56"
        | "400gbase-x-qsfpdd"
        | "400gbase-x-osfp"
        | "ieee802.11a"
        | "ieee802.11g"
        | "ieee802.11n"
        | "ieee802.11ac"
        | "ieee802.11ad"
        | "ieee802.11ax"
        | "ieee802.15.1"
        | "gsm"
        | "cdma"
        | "lte"
        | "sonet-oc3"
        | "sonet-oc12"
        | "sonet-oc48"
        | "sonet-oc192"
        | "sonet-oc768"
        | "sonet-oc1920"
        | "sonet-oc3840"
        | "1gfc-sfp"
        | "2gfc-sfp"
        | "4gfc-sfp"
        | "8gfc-sfpp"
        | "16gfc-sfpp"
        | "32gfc-sfp28"
        | "64gfc-qsfpp"
        | "128gfc-qsfp28"
        | "infiniband-sdr"
        | "infiniband-ddr"
        | "infiniband-qdr"
        | "infiniband-fdr10"
        | "infiniband-fdr"
        | "infiniband-edr"
        | "infiniband-hdr"
        | "infiniband-ndr"
        | "infiniband-xdr"
        | "t1"
        | "e1"
        | "t3"
        | "e3"
        | "xdsl"
        | "cisco-stackwise"
        | "cisco-stackwise-plus"
        | "cisco-flexstack"
        | "cisco-flexstack-plus"
        | "cisco-stackwise-80"
        | "cisco-stackwise-160"
        | "cisco-stackwise-320"
        | "cisco-stackwise-480"
        | "juniper-vcp"
        | "extreme-summitstack"
        | "extreme-summitstack-128"
        | "extreme-summitstack-256"
        | "extreme-summitstack-512"
        | "other";
    };

    /** Management only */
    mgmt_only?: boolean;

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableInterfaceTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device type */
    device_type?: number | null;

    /** Module type */
    module_type?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type:
      | "virtual"
      | "bridge"
      | "lag"
      | "100base-tx"
      | "1000base-t"
      | "2.5gbase-t"
      | "5gbase-t"
      | "10gbase-t"
      | "10gbase-cx4"
      | "1000base-x-gbic"
      | "1000base-x-sfp"
      | "10gbase-x-sfpp"
      | "10gbase-x-xfp"
      | "10gbase-x-xenpak"
      | "10gbase-x-x2"
      | "25gbase-x-sfp28"
      | "50gbase-x-sfp56"
      | "40gbase-x-qsfpp"
      | "50gbase-x-sfp28"
      | "100gbase-x-cfp"
      | "100gbase-x-cfp2"
      | "200gbase-x-cfp2"
      | "100gbase-x-cfp4"
      | "100gbase-x-cpak"
      | "100gbase-x-qsfp28"
      | "200gbase-x-qsfp56"
      | "400gbase-x-qsfpdd"
      | "400gbase-x-osfp"
      | "ieee802.11a"
      | "ieee802.11g"
      | "ieee802.11n"
      | "ieee802.11ac"
      | "ieee802.11ad"
      | "ieee802.11ax"
      | "ieee802.15.1"
      | "gsm"
      | "cdma"
      | "lte"
      | "sonet-oc3"
      | "sonet-oc12"
      | "sonet-oc48"
      | "sonet-oc192"
      | "sonet-oc768"
      | "sonet-oc1920"
      | "sonet-oc3840"
      | "1gfc-sfp"
      | "2gfc-sfp"
      | "4gfc-sfp"
      | "8gfc-sfpp"
      | "16gfc-sfpp"
      | "32gfc-sfp28"
      | "64gfc-qsfpp"
      | "128gfc-qsfp28"
      | "infiniband-sdr"
      | "infiniband-ddr"
      | "infiniband-qdr"
      | "infiniband-fdr10"
      | "infiniband-fdr"
      | "infiniband-edr"
      | "infiniband-hdr"
      | "infiniband-ndr"
      | "infiniband-xdr"
      | "t1"
      | "e1"
      | "t3"
      | "e3"
      | "xdsl"
      | "cisco-stackwise"
      | "cisco-stackwise-plus"
      | "cisco-flexstack"
      | "cisco-flexstack-plus"
      | "cisco-stackwise-80"
      | "cisco-stackwise-160"
      | "cisco-stackwise-320"
      | "cisco-stackwise-480"
      | "juniper-vcp"
      | "extreme-summitstack"
      | "extreme-summitstack-128"
      | "extreme-summitstack-256"
      | "extreme-summitstack-512"
      | "other";

    /** Management only */
    mgmt_only?: boolean;

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface NestedInterface {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device?: NestedDevice;

    /** Name */
    name: string;

    /** Cable */
    cable?: number | null;

    /** occupied */
    _occupied?: string;
  }

  export interface NestedVLAN {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /**
     * ID
     * @min 1
     * @max 4094
     */
    vid: number;

    /** Name */
    name: string;
  }

  export interface NestedWirelessLink {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** SSID */
    ssid?: string;
  }

  export interface NestedWirelessLAN {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** SSID */
    ssid: string;
  }

  export interface NestedVRF {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Route distinguisher
     * Unique route distinguisher (as defined in RFC 4364)
     */
    rd?: string | null;

    /** Prefix count */
    prefix_count?: number;
  }

  export interface Interface {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device: NestedDevice;
    module?: ComponentNestedModule;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type: {
      label:
        | "Virtual"
        | "Bridge"
        | "Link Aggregation Group (LAG)"
        | "100BASE-TX (10/100ME)"
        | "1000BASE-T (1GE)"
        | "2.5GBASE-T (2.5GE)"
        | "5GBASE-T (5GE)"
        | "10GBASE-T (10GE)"
        | "10GBASE-CX4 (10GE)"
        | "GBIC (1GE)"
        | "SFP (1GE)"
        | "SFP+ (10GE)"
        | "XFP (10GE)"
        | "XENPAK (10GE)"
        | "X2 (10GE)"
        | "SFP28 (25GE)"
        | "SFP56 (50GE)"
        | "QSFP+ (40GE)"
        | "QSFP28 (50GE)"
        | "CFP (100GE)"
        | "CFP2 (100GE)"
        | "CFP2 (200GE)"
        | "CFP4 (100GE)"
        | "Cisco CPAK (100GE)"
        | "QSFP28 (100GE)"
        | "QSFP56 (200GE)"
        | "QSFP-DD (400GE)"
        | "OSFP (400GE)"
        | "IEEE 802.11a"
        | "IEEE 802.11b/g"
        | "IEEE 802.11n"
        | "IEEE 802.11ac"
        | "IEEE 802.11ad"
        | "IEEE 802.11ax"
        | "IEEE 802.15.1 (Bluetooth)"
        | "GSM"
        | "CDMA"
        | "LTE"
        | "OC-3/STM-1"
        | "OC-12/STM-4"
        | "OC-48/STM-16"
        | "OC-192/STM-64"
        | "OC-768/STM-256"
        | "OC-1920/STM-640"
        | "OC-3840/STM-1234"
        | "SFP (1GFC)"
        | "SFP (2GFC)"
        | "SFP (4GFC)"
        | "SFP+ (8GFC)"
        | "SFP+ (16GFC)"
        | "SFP28 (32GFC)"
        | "QSFP+ (64GFC)"
        | "QSFP28 (128GFC)"
        | "SDR (2 Gbps)"
        | "DDR (4 Gbps)"
        | "QDR (8 Gbps)"
        | "FDR10 (10 Gbps)"
        | "FDR (13.5 Gbps)"
        | "EDR (25 Gbps)"
        | "HDR (50 Gbps)"
        | "NDR (100 Gbps)"
        | "XDR (250 Gbps)"
        | "T1 (1.544 Mbps)"
        | "E1 (2.048 Mbps)"
        | "T3 (45 Mbps)"
        | "E3 (34 Mbps)"
        | "xDSL"
        | "Cisco StackWise"
        | "Cisco StackWise Plus"
        | "Cisco FlexStack"
        | "Cisco FlexStack Plus"
        | "Cisco StackWise-80"
        | "Cisco StackWise-160"
        | "Cisco StackWise-320"
        | "Cisco StackWise-480"
        | "Juniper VCP"
        | "Extreme SummitStack"
        | "Extreme SummitStack-128"
        | "Extreme SummitStack-256"
        | "Extreme SummitStack-512"
        | "Other";
      value:
        | "virtual"
        | "bridge"
        | "lag"
        | "100base-tx"
        | "1000base-t"
        | "2.5gbase-t"
        | "5gbase-t"
        | "10gbase-t"
        | "10gbase-cx4"
        | "1000base-x-gbic"
        | "1000base-x-sfp"
        | "10gbase-x-sfpp"
        | "10gbase-x-xfp"
        | "10gbase-x-xenpak"
        | "10gbase-x-x2"
        | "25gbase-x-sfp28"
        | "50gbase-x-sfp56"
        | "40gbase-x-qsfpp"
        | "50gbase-x-sfp28"
        | "100gbase-x-cfp"
        | "100gbase-x-cfp2"
        | "200gbase-x-cfp2"
        | "100gbase-x-cfp4"
        | "100gbase-x-cpak"
        | "100gbase-x-qsfp28"
        | "200gbase-x-qsfp56"
        | "400gbase-x-qsfpdd"
        | "400gbase-x-osfp"
        | "ieee802.11a"
        | "ieee802.11g"
        | "ieee802.11n"
        | "ieee802.11ac"
        | "ieee802.11ad"
        | "ieee802.11ax"
        | "ieee802.15.1"
        | "gsm"
        | "cdma"
        | "lte"
        | "sonet-oc3"
        | "sonet-oc12"
        | "sonet-oc48"
        | "sonet-oc192"
        | "sonet-oc768"
        | "sonet-oc1920"
        | "sonet-oc3840"
        | "1gfc-sfp"
        | "2gfc-sfp"
        | "4gfc-sfp"
        | "8gfc-sfpp"
        | "16gfc-sfpp"
        | "32gfc-sfp28"
        | "64gfc-qsfpp"
        | "128gfc-qsfp28"
        | "infiniband-sdr"
        | "infiniband-ddr"
        | "infiniband-qdr"
        | "infiniband-fdr10"
        | "infiniband-fdr"
        | "infiniband-edr"
        | "infiniband-hdr"
        | "infiniband-ndr"
        | "infiniband-xdr"
        | "t1"
        | "e1"
        | "t3"
        | "e3"
        | "xdsl"
        | "cisco-stackwise"
        | "cisco-stackwise-plus"
        | "cisco-flexstack"
        | "cisco-flexstack-plus"
        | "cisco-stackwise-80"
        | "cisco-stackwise-160"
        | "cisco-stackwise-320"
        | "cisco-stackwise-480"
        | "juniper-vcp"
        | "extreme-summitstack"
        | "extreme-summitstack-128"
        | "extreme-summitstack-256"
        | "extreme-summitstack-512"
        | "other";
    };

    /** Enabled */
    enabled?: boolean;
    parent?: NestedInterface;
    bridge?: NestedInterface;
    lag?: NestedInterface;

    /**
     * MTU
     * @min 1
     * @max 65536
     */
    mtu?: number | null;

    /** MAC Address */
    mac_address?: string | null;

    /**
     * Speed (Kbps)
     * @min 0
     * @max 2147483647
     */
    speed?: number | null;

    /** Duplex */
    duplex?: {
      label: "Half" | "Full" | "Auto";
      value: "half" | "full" | "auto";
    };

    /**
     * WWN
     * 64-bit World Wide Name
     */
    wwn?: string | null;

    /**
     * Management only
     * This interface is used only for out-of-band management
     */
    mgmt_only?: boolean;

    /** Description */
    description?: string;

    /** Mode */
    mode?: {
      label: "Access" | "Tagged" | "Tagged (All)";
      value: "access" | "tagged" | "tagged-all";
    };

    /** Rf role */
    rf_role?: { label: "Access point" | "Station"; value: "ap" | "station" };

    /** Rf channel */
    rf_channel?: {
      label:
        | "1 (2412 MHz)"
        | "2 (2417 MHz)"
        | "3 (2422 MHz)"
        | "4 (2427 MHz)"
        | "5 (2432 MHz)"
        | "6 (2437 MHz)"
        | "7 (2442 MHz)"
        | "8 (2447 MHz)"
        | "9 (2452 MHz)"
        | "10 (2457 MHz)"
        | "11 (2462 MHz)"
        | "12 (2467 MHz)"
        | "13 (2472 MHz)"
        | "32 (5160/20 MHz)"
        | "34 (5170/40 MHz)"
        | "36 (5180/20 MHz)"
        | "38 (5190/40 MHz)"
        | "40 (5200/20 MHz)"
        | "42 (5210/80 MHz)"
        | "44 (5220/20 MHz)"
        | "46 (5230/40 MHz)"
        | "48 (5240/20 MHz)"
        | "50 (5250/160 MHz)"
        | "52 (5260/20 MHz)"
        | "54 (5270/40 MHz)"
        | "56 (5280/20 MHz)"
        | "58 (5290/80 MHz)"
        | "60 (5300/20 MHz)"
        | "62 (5310/40 MHz)"
        | "64 (5320/20 MHz)"
        | "100 (5500/20 MHz)"
        | "102 (5510/40 MHz)"
        | "104 (5520/20 MHz)"
        | "106 (5530/80 MHz)"
        | "108 (5540/20 MHz)"
        | "110 (5550/40 MHz)"
        | "112 (5560/20 MHz)"
        | "114 (5570/160 MHz)"
        | "116 (5580/20 MHz)"
        | "118 (5590/40 MHz)"
        | "120 (5600/20 MHz)"
        | "122 (5610/80 MHz)"
        | "124 (5620/20 MHz)"
        | "126 (5630/40 MHz)"
        | "128 (5640/20 MHz)"
        | "132 (5660/20 MHz)"
        | "134 (5670/40 MHz)"
        | "136 (5680/20 MHz)"
        | "138 (5690/80 MHz)"
        | "140 (5700/20 MHz)"
        | "142 (5710/40 MHz)"
        | "144 (5720/20 MHz)"
        | "149 (5745/20 MHz)"
        | "151 (5755/40 MHz)"
        | "153 (5765/20 MHz)"
        | "155 (5775/80 MHz)"
        | "157 (5785/20 MHz)"
        | "159 (5795/40 MHz)"
        | "161 (5805/20 MHz)"
        | "163 (5815/160 MHz)"
        | "165 (5825/20 MHz)"
        | "167 (5835/40 MHz)"
        | "169 (5845/20 MHz)"
        | "171 (5855/80 MHz)"
        | "173 (5865/20 MHz)"
        | "175 (5875/40 MHz)"
        | "177 (5885/20 MHz)"
        | "1 (5955/20 MHz)"
        | "3 (5965/40 MHz)"
        | "5 (5975/20 MHz)"
        | "7 (5985/80 MHz)"
        | "9 (5995/20 MHz)"
        | "11 (6005/40 MHz)"
        | "13 (6015/20 MHz)"
        | "15 (6025/160 MHz)"
        | "17 (6035/20 MHz)"
        | "19 (6045/40 MHz)"
        | "21 (6055/20 MHz)"
        | "23 (6065/80 MHz)"
        | "25 (6075/20 MHz)"
        | "27 (6085/40 MHz)"
        | "29 (6095/20 MHz)"
        | "31 (6105/320 MHz)"
        | "33 (6115/20 MHz)"
        | "35 (6125/40 MHz)"
        | "37 (6135/20 MHz)"
        | "39 (6145/80 MHz)"
        | "41 (6155/20 MHz)"
        | "43 (6165/40 MHz)"
        | "45 (6175/20 MHz)"
        | "47 (6185/160 MHz)"
        | "49 (6195/20 MHz)"
        | "51 (6205/40 MHz)"
        | "53 (6215/20 MHz)"
        | "55 (6225/80 MHz)"
        | "57 (6235/20 MHz)"
        | "59 (6245/40 MHz)"
        | "61 (6255/20 MHz)"
        | "65 (6275/20 MHz)"
        | "67 (6285/40 MHz)"
        | "69 (6295/20 MHz)"
        | "71 (6305/80 MHz)"
        | "73 (6315/20 MHz)"
        | "75 (6325/40 MHz)"
        | "77 (6335/20 MHz)"
        | "79 (6345/160 MHz)"
        | "81 (6355/20 MHz)"
        | "83 (6365/40 MHz)"
        | "85 (6375/20 MHz)"
        | "87 (6385/80 MHz)"
        | "89 (6395/20 MHz)"
        | "91 (6405/40 MHz)"
        | "93 (6415/20 MHz)"
        | "95 (6425/320 MHz)"
        | "97 (6435/20 MHz)"
        | "99 (6445/40 MHz)"
        | "101 (6455/20 MHz)"
        | "103 (6465/80 MHz)"
        | "105 (6475/20 MHz)"
        | "107 (6485/40 MHz)"
        | "109 (6495/20 MHz)"
        | "111 (6505/160 MHz)"
        | "113 (6515/20 MHz)"
        | "115 (6525/40 MHz)"
        | "117 (6535/20 MHz)"
        | "119 (6545/80 MHz)"
        | "121 (6555/20 MHz)"
        | "123 (6565/40 MHz)"
        | "125 (6575/20 MHz)"
        | "129 (6595/20 MHz)"
        | "131 (6605/40 MHz)"
        | "133 (6615/20 MHz)"
        | "135 (6625/80 MHz)"
        | "137 (6635/20 MHz)"
        | "139 (6645/40 MHz)"
        | "141 (6655/20 MHz)"
        | "143 (6665/160 MHz)"
        | "145 (6675/20 MHz)"
        | "147 (6685/40 MHz)"
        | "149 (6695/20 MHz)"
        | "151 (6705/80 MHz)"
        | "153 (6715/20 MHz)"
        | "155 (6725/40 MHz)"
        | "157 (6735/20 MHz)"
        | "159 (6745/320 MHz)"
        | "161 (6755/20 MHz)"
        | "163 (6765/40 MHz)"
        | "165 (6775/20 MHz)"
        | "167 (6785/80 MHz)"
        | "169 (6795/20 MHz)"
        | "171 (6805/40 MHz)"
        | "173 (6815/20 MHz)"
        | "175 (6825/160 MHz)"
        | "177 (6835/20 MHz)"
        | "179 (6845/40 MHz)"
        | "181 (6855/20 MHz)"
        | "183 (6865/80 MHz)"
        | "185 (6875/20 MHz)"
        | "187 (6885/40 MHz)"
        | "189 (6895/20 MHz)"
        | "193 (6915/20 MHz)"
        | "195 (6925/40 MHz)"
        | "197 (6935/20 MHz)"
        | "199 (6945/80 MHz)"
        | "201 (6955/20 MHz)"
        | "203 (6965/40 MHz)"
        | "205 (6975/20 MHz)"
        | "207 (6985/160 MHz)"
        | "209 (6995/20 MHz)"
        | "211 (7005/40 MHz)"
        | "213 (7015/20 MHz)"
        | "215 (7025/80 MHz)"
        | "217 (7035/20 MHz)"
        | "219 (7045/40 MHz)"
        | "221 (7055/20 MHz)"
        | "225 (7075/20 MHz)"
        | "227 (7085/40 MHz)"
        | "229 (7095/20 MHz)"
        | "233 (7115/20 MHz)"
        | "1 (58.32/2.16 GHz)"
        | "2 (60.48/2.16 GHz)"
        | "3 (62.64/2.16 GHz)"
        | "4 (64.80/2.16 GHz)"
        | "5 (66.96/2.16 GHz)"
        | "6 (69.12/2.16 GHz)"
        | "9 (59.40/4.32 GHz)"
        | "10 (61.56/4.32 GHz)"
        | "11 (63.72/4.32 GHz)"
        | "12 (65.88/4.32 GHz)"
        | "13 (68.04/4.32 GHz)"
        | "17 (60.48/6.48 GHz)"
        | "18 (62.64/6.48 GHz)"
        | "19 (64.80/6.48 GHz)"
        | "20 (66.96/6.48 GHz)"
        | "25 (61.56/8.64 GHz)"
        | "26 (63.72/8.64 GHz)"
        | "27 (65.88/8.64 GHz)";
      value:
        | "2.4g-1-2412-22"
        | "2.4g-2-2417-22"
        | "2.4g-3-2422-22"
        | "2.4g-4-2427-22"
        | "2.4g-5-2432-22"
        | "2.4g-6-2437-22"
        | "2.4g-7-2442-22"
        | "2.4g-8-2447-22"
        | "2.4g-9-2452-22"
        | "2.4g-10-2457-22"
        | "2.4g-11-2462-22"
        | "2.4g-12-2467-22"
        | "2.4g-13-2472-22"
        | "5g-32-5160-20"
        | "5g-34-5170-40"
        | "5g-36-5180-20"
        | "5g-38-5190-40"
        | "5g-40-5200-20"
        | "5g-42-5210-80"
        | "5g-44-5220-20"
        | "5g-46-5230-40"
        | "5g-48-5240-20"
        | "5g-50-5250-160"
        | "5g-52-5260-20"
        | "5g-54-5270-40"
        | "5g-56-5280-20"
        | "5g-58-5290-80"
        | "5g-60-5300-20"
        | "5g-62-5310-40"
        | "5g-64-5320-20"
        | "5g-100-5500-20"
        | "5g-102-5510-40"
        | "5g-104-5520-20"
        | "5g-106-5530-80"
        | "5g-108-5540-20"
        | "5g-110-5550-40"
        | "5g-112-5560-20"
        | "5g-114-5570-160"
        | "5g-116-5580-20"
        | "5g-118-5590-40"
        | "5g-120-5600-20"
        | "5g-122-5610-80"
        | "5g-124-5620-20"
        | "5g-126-5630-40"
        | "5g-128-5640-20"
        | "5g-132-5660-20"
        | "5g-134-5670-40"
        | "5g-136-5680-20"
        | "5g-138-5690-80"
        | "5g-140-5700-20"
        | "5g-142-5710-40"
        | "5g-144-5720-20"
        | "5g-149-5745-20"
        | "5g-151-5755-40"
        | "5g-153-5765-20"
        | "5g-155-5775-80"
        | "5g-157-5785-20"
        | "5g-159-5795-40"
        | "5g-161-5805-20"
        | "5g-163-5815-160"
        | "5g-165-5825-20"
        | "5g-167-5835-40"
        | "5g-169-5845-20"
        | "5g-171-5855-80"
        | "5g-173-5865-20"
        | "5g-175-5875-40"
        | "5g-177-5885-20"
        | "6g-1-5955-20"
        | "6g-3-5965-40"
        | "6g-5-5975-20"
        | "6g-7-5985-80"
        | "6g-9-5995-20"
        | "6g-11-6005-40"
        | "6g-13-6015-20"
        | "6g-15-6025-160"
        | "6g-17-6035-20"
        | "6g-19-6045-40"
        | "6g-21-6055-20"
        | "6g-23-6065-80"
        | "6g-25-6075-20"
        | "6g-27-6085-40"
        | "6g-29-6095-20"
        | "6g-31-6105-320"
        | "6g-33-6115-20"
        | "6g-35-6125-40"
        | "6g-37-6135-20"
        | "6g-39-6145-80"
        | "6g-41-6155-20"
        | "6g-43-6165-40"
        | "6g-45-6175-20"
        | "6g-47-6185-160"
        | "6g-49-6195-20"
        | "6g-51-6205-40"
        | "6g-53-6215-20"
        | "6g-55-6225-80"
        | "6g-57-6235-20"
        | "6g-59-6245-40"
        | "6g-61-6255-20"
        | "6g-65-6275-20"
        | "6g-67-6285-40"
        | "6g-69-6295-20"
        | "6g-71-6305-80"
        | "6g-73-6315-20"
        | "6g-75-6325-40"
        | "6g-77-6335-20"
        | "6g-79-6345-160"
        | "6g-81-6355-20"
        | "6g-83-6365-40"
        | "6g-85-6375-20"
        | "6g-87-6385-80"
        | "6g-89-6395-20"
        | "6g-91-6405-40"
        | "6g-93-6415-20"
        | "6g-95-6425-320"
        | "6g-97-6435-20"
        | "6g-99-6445-40"
        | "6g-101-6455-20"
        | "6g-103-6465-80"
        | "6g-105-6475-20"
        | "6g-107-6485-40"
        | "6g-109-6495-20"
        | "6g-111-6505-160"
        | "6g-113-6515-20"
        | "6g-115-6525-40"
        | "6g-117-6535-20"
        | "6g-119-6545-80"
        | "6g-121-6555-20"
        | "6g-123-6565-40"
        | "6g-125-6575-20"
        | "6g-129-6595-20"
        | "6g-131-6605-40"
        | "6g-133-6615-20"
        | "6g-135-6625-80"
        | "6g-137-6635-20"
        | "6g-139-6645-40"
        | "6g-141-6655-20"
        | "6g-143-6665-160"
        | "6g-145-6675-20"
        | "6g-147-6685-40"
        | "6g-149-6695-20"
        | "6g-151-6705-80"
        | "6g-153-6715-20"
        | "6g-155-6725-40"
        | "6g-157-6735-20"
        | "6g-159-6745-320"
        | "6g-161-6755-20"
        | "6g-163-6765-40"
        | "6g-165-6775-20"
        | "6g-167-6785-80"
        | "6g-169-6795-20"
        | "6g-171-6805-40"
        | "6g-173-6815-20"
        | "6g-175-6825-160"
        | "6g-177-6835-20"
        | "6g-179-6845-40"
        | "6g-181-6855-20"
        | "6g-183-6865-80"
        | "6g-185-6875-20"
        | "6g-187-6885-40"
        | "6g-189-6895-20"
        | "6g-193-6915-20"
        | "6g-195-6925-40"
        | "6g-197-6935-20"
        | "6g-199-6945-80"
        | "6g-201-6955-20"
        | "6g-203-6965-40"
        | "6g-205-6975-20"
        | "6g-207-6985-160"
        | "6g-209-6995-20"
        | "6g-211-7005-40"
        | "6g-213-7015-20"
        | "6g-215-7025-80"
        | "6g-217-7035-20"
        | "6g-219-7045-40"
        | "6g-221-7055-20"
        | "6g-225-7075-20"
        | "6g-227-7085-40"
        | "6g-229-7095-20"
        | "6g-233-7115-20"
        | "60g-1-58320-2160"
        | "60g-2-60480-2160"
        | "60g-3-62640-2160"
        | "60g-4-64800-2160"
        | "60g-5-66960-2160"
        | "60g-6-69120-2160"
        | "60g-9-59400-4320"
        | "60g-10-61560-4320"
        | "60g-11-63720-4320"
        | "60g-12-65880-4320"
        | "60g-13-68040-4320"
        | "60g-17-60480-6480"
        | "60g-18-62640-6480"
        | "60g-19-64800-6480"
        | "60g-20-66960-6480"
        | "60g-25-61560-6480"
        | "60g-26-63720-6480"
        | "60g-27-65880-6480";
    };

    /**
     * Channel frequency (MHz)
     * @format decimal
     */
    rf_channel_frequency?: number | null;

    /**
     * Channel width (MHz)
     * @format decimal
     */
    rf_channel_width?: number | null;

    /**
     * Transmit power (dBm)
     * @min 0
     * @max 127
     */
    tx_power?: number | null;
    untagged_vlan?: NestedVLAN;
    tagged_vlans?: NestedVLAN[];

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;
    wireless_link?: NestedWirelessLink;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;
    wireless_lans?: NestedWirelessLAN[];
    vrf?: NestedVRF;

    /**
     * Connected endpoint
     *
     * Return the appropriate serializer for the type of connected object.
     */
    connected_endpoint?: Record<string, string | null>;

    /** Connected endpoint type */
    connected_endpoint_type?: string;

    /** Connected endpoint reachable */
    connected_endpoint_reachable?: boolean;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Count ipaddresses */
    count_ipaddresses?: number;

    /** Count fhrp groups */
    count_fhrp_groups?: number;

    /** occupied */
    _occupied?: boolean;
  }

  export interface WritableInterface {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device */
    device: number;

    /** Module */
    module?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type:
      | "virtual"
      | "bridge"
      | "lag"
      | "100base-tx"
      | "1000base-t"
      | "2.5gbase-t"
      | "5gbase-t"
      | "10gbase-t"
      | "10gbase-cx4"
      | "1000base-x-gbic"
      | "1000base-x-sfp"
      | "10gbase-x-sfpp"
      | "10gbase-x-xfp"
      | "10gbase-x-xenpak"
      | "10gbase-x-x2"
      | "25gbase-x-sfp28"
      | "50gbase-x-sfp56"
      | "40gbase-x-qsfpp"
      | "50gbase-x-sfp28"
      | "100gbase-x-cfp"
      | "100gbase-x-cfp2"
      | "200gbase-x-cfp2"
      | "100gbase-x-cfp4"
      | "100gbase-x-cpak"
      | "100gbase-x-qsfp28"
      | "200gbase-x-qsfp56"
      | "400gbase-x-qsfpdd"
      | "400gbase-x-osfp"
      | "ieee802.11a"
      | "ieee802.11g"
      | "ieee802.11n"
      | "ieee802.11ac"
      | "ieee802.11ad"
      | "ieee802.11ax"
      | "ieee802.15.1"
      | "gsm"
      | "cdma"
      | "lte"
      | "sonet-oc3"
      | "sonet-oc12"
      | "sonet-oc48"
      | "sonet-oc192"
      | "sonet-oc768"
      | "sonet-oc1920"
      | "sonet-oc3840"
      | "1gfc-sfp"
      | "2gfc-sfp"
      | "4gfc-sfp"
      | "8gfc-sfpp"
      | "16gfc-sfpp"
      | "32gfc-sfp28"
      | "64gfc-qsfpp"
      | "128gfc-qsfp28"
      | "infiniband-sdr"
      | "infiniband-ddr"
      | "infiniband-qdr"
      | "infiniband-fdr10"
      | "infiniband-fdr"
      | "infiniband-edr"
      | "infiniband-hdr"
      | "infiniband-ndr"
      | "infiniband-xdr"
      | "t1"
      | "e1"
      | "t3"
      | "e3"
      | "xdsl"
      | "cisco-stackwise"
      | "cisco-stackwise-plus"
      | "cisco-flexstack"
      | "cisco-flexstack-plus"
      | "cisco-stackwise-80"
      | "cisco-stackwise-160"
      | "cisco-stackwise-320"
      | "cisco-stackwise-480"
      | "juniper-vcp"
      | "extreme-summitstack"
      | "extreme-summitstack-128"
      | "extreme-summitstack-256"
      | "extreme-summitstack-512"
      | "other";

    /** Enabled */
    enabled?: boolean;

    /** Parent interface */
    parent?: number | null;

    /** Bridge interface */
    bridge?: number | null;

    /** Parent LAG */
    lag?: number | null;

    /**
     * MTU
     * @min 1
     * @max 65536
     */
    mtu?: number | null;

    /** MAC Address */
    mac_address?: string | null;

    /**
     * Speed (Kbps)
     * @min 0
     * @max 2147483647
     */
    speed?: number | null;

    /** Duplex */
    duplex?: "half" | "full" | "auto" | null;

    /**
     * WWN
     * 64-bit World Wide Name
     */
    wwn?: string | null;

    /**
     * Management only
     * This interface is used only for out-of-band management
     */
    mgmt_only?: boolean;

    /** Description */
    description?: string;

    /** Mode */
    mode?: "access" | "tagged" | "tagged-all";

    /** Wireless role */
    rf_role?: "ap" | "station";

    /** Wireless channel */
    rf_channel?:
      | "2.4g-1-2412-22"
      | "2.4g-2-2417-22"
      | "2.4g-3-2422-22"
      | "2.4g-4-2427-22"
      | "2.4g-5-2432-22"
      | "2.4g-6-2437-22"
      | "2.4g-7-2442-22"
      | "2.4g-8-2447-22"
      | "2.4g-9-2452-22"
      | "2.4g-10-2457-22"
      | "2.4g-11-2462-22"
      | "2.4g-12-2467-22"
      | "2.4g-13-2472-22"
      | "5g-32-5160-20"
      | "5g-34-5170-40"
      | "5g-36-5180-20"
      | "5g-38-5190-40"
      | "5g-40-5200-20"
      | "5g-42-5210-80"
      | "5g-44-5220-20"
      | "5g-46-5230-40"
      | "5g-48-5240-20"
      | "5g-50-5250-160"
      | "5g-52-5260-20"
      | "5g-54-5270-40"
      | "5g-56-5280-20"
      | "5g-58-5290-80"
      | "5g-60-5300-20"
      | "5g-62-5310-40"
      | "5g-64-5320-20"
      | "5g-100-5500-20"
      | "5g-102-5510-40"
      | "5g-104-5520-20"
      | "5g-106-5530-80"
      | "5g-108-5540-20"
      | "5g-110-5550-40"
      | "5g-112-5560-20"
      | "5g-114-5570-160"
      | "5g-116-5580-20"
      | "5g-118-5590-40"
      | "5g-120-5600-20"
      | "5g-122-5610-80"
      | "5g-124-5620-20"
      | "5g-126-5630-40"
      | "5g-128-5640-20"
      | "5g-132-5660-20"
      | "5g-134-5670-40"
      | "5g-136-5680-20"
      | "5g-138-5690-80"
      | "5g-140-5700-20"
      | "5g-142-5710-40"
      | "5g-144-5720-20"
      | "5g-149-5745-20"
      | "5g-151-5755-40"
      | "5g-153-5765-20"
      | "5g-155-5775-80"
      | "5g-157-5785-20"
      | "5g-159-5795-40"
      | "5g-161-5805-20"
      | "5g-163-5815-160"
      | "5g-165-5825-20"
      | "5g-167-5835-40"
      | "5g-169-5845-20"
      | "5g-171-5855-80"
      | "5g-173-5865-20"
      | "5g-175-5875-40"
      | "5g-177-5885-20"
      | "6g-1-5955-20"
      | "6g-3-5965-40"
      | "6g-5-5975-20"
      | "6g-7-5985-80"
      | "6g-9-5995-20"
      | "6g-11-6005-40"
      | "6g-13-6015-20"
      | "6g-15-6025-160"
      | "6g-17-6035-20"
      | "6g-19-6045-40"
      | "6g-21-6055-20"
      | "6g-23-6065-80"
      | "6g-25-6075-20"
      | "6g-27-6085-40"
      | "6g-29-6095-20"
      | "6g-31-6105-320"
      | "6g-33-6115-20"
      | "6g-35-6125-40"
      | "6g-37-6135-20"
      | "6g-39-6145-80"
      | "6g-41-6155-20"
      | "6g-43-6165-40"
      | "6g-45-6175-20"
      | "6g-47-6185-160"
      | "6g-49-6195-20"
      | "6g-51-6205-40"
      | "6g-53-6215-20"
      | "6g-55-6225-80"
      | "6g-57-6235-20"
      | "6g-59-6245-40"
      | "6g-61-6255-20"
      | "6g-65-6275-20"
      | "6g-67-6285-40"
      | "6g-69-6295-20"
      | "6g-71-6305-80"
      | "6g-73-6315-20"
      | "6g-75-6325-40"
      | "6g-77-6335-20"
      | "6g-79-6345-160"
      | "6g-81-6355-20"
      | "6g-83-6365-40"
      | "6g-85-6375-20"
      | "6g-87-6385-80"
      | "6g-89-6395-20"
      | "6g-91-6405-40"
      | "6g-93-6415-20"
      | "6g-95-6425-320"
      | "6g-97-6435-20"
      | "6g-99-6445-40"
      | "6g-101-6455-20"
      | "6g-103-6465-80"
      | "6g-105-6475-20"
      | "6g-107-6485-40"
      | "6g-109-6495-20"
      | "6g-111-6505-160"
      | "6g-113-6515-20"
      | "6g-115-6525-40"
      | "6g-117-6535-20"
      | "6g-119-6545-80"
      | "6g-121-6555-20"
      | "6g-123-6565-40"
      | "6g-125-6575-20"
      | "6g-129-6595-20"
      | "6g-131-6605-40"
      | "6g-133-6615-20"
      | "6g-135-6625-80"
      | "6g-137-6635-20"
      | "6g-139-6645-40"
      | "6g-141-6655-20"
      | "6g-143-6665-160"
      | "6g-145-6675-20"
      | "6g-147-6685-40"
      | "6g-149-6695-20"
      | "6g-151-6705-80"
      | "6g-153-6715-20"
      | "6g-155-6725-40"
      | "6g-157-6735-20"
      | "6g-159-6745-320"
      | "6g-161-6755-20"
      | "6g-163-6765-40"
      | "6g-165-6775-20"
      | "6g-167-6785-80"
      | "6g-169-6795-20"
      | "6g-171-6805-40"
      | "6g-173-6815-20"
      | "6g-175-6825-160"
      | "6g-177-6835-20"
      | "6g-179-6845-40"
      | "6g-181-6855-20"
      | "6g-183-6865-80"
      | "6g-185-6875-20"
      | "6g-187-6885-40"
      | "6g-189-6895-20"
      | "6g-193-6915-20"
      | "6g-195-6925-40"
      | "6g-197-6935-20"
      | "6g-199-6945-80"
      | "6g-201-6955-20"
      | "6g-203-6965-40"
      | "6g-205-6975-20"
      | "6g-207-6985-160"
      | "6g-209-6995-20"
      | "6g-211-7005-40"
      | "6g-213-7015-20"
      | "6g-215-7025-80"
      | "6g-217-7035-20"
      | "6g-219-7045-40"
      | "6g-221-7055-20"
      | "6g-225-7075-20"
      | "6g-227-7085-40"
      | "6g-229-7095-20"
      | "6g-233-7115-20"
      | "60g-1-58320-2160"
      | "60g-2-60480-2160"
      | "60g-3-62640-2160"
      | "60g-4-64800-2160"
      | "60g-5-66960-2160"
      | "60g-6-69120-2160"
      | "60g-9-59400-4320"
      | "60g-10-61560-4320"
      | "60g-11-63720-4320"
      | "60g-12-65880-4320"
      | "60g-13-68040-4320"
      | "60g-17-60480-6480"
      | "60g-18-62640-6480"
      | "60g-19-64800-6480"
      | "60g-20-66960-6480"
      | "60g-25-61560-6480"
      | "60g-26-63720-6480"
      | "60g-27-65880-6480";

    /**
     * Channel frequency (MHz)
     * @format decimal
     */
    rf_channel_frequency?: number | null;

    /**
     * Channel width (MHz)
     * @format decimal
     */
    rf_channel_width?: number | null;

    /**
     * Transmit power (dBm)
     * @min 0
     * @max 127
     */
    tx_power?: number | null;

    /** Untagged VLAN */
    untagged_vlan?: number | null;
    tagged_vlans?: number[];

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /** Wireless link */
    wireless_link?: number | null;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;
    wireless_lans?: number[];

    /** VRF */
    vrf?: number | null;

    /**
     * Connected endpoint
     *
     * Return the appropriate serializer for the type of connected object.
     */
    connected_endpoint?: Record<string, string | null>;

    /** Connected endpoint type */
    connected_endpoint_type?: string;

    /** Connected endpoint reachable */
    connected_endpoint_reachable?: boolean;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Count ipaddresses */
    count_ipaddresses?: number;

    /** Count fhrp groups */
    count_fhrp_groups?: number;

    /** occupied */
    _occupied?: boolean;
  }

  export interface InventoryItemRole {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /**
     * Color
     * @pattern ^[0-9a-f]{6}$
     */
    color?: string;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Inventoryitem count */
    inventoryitem_count?: number;
  }

  export interface NestedInventoryItemRole {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Inventoryitem count */
    inventoryitem_count?: number;
  }

  export interface InventoryItemTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device_type: NestedDeviceType;

    /** Parent */
    parent?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;
    role?: NestedInventoryItemRole;
    manufacturer?: NestedManufacturer;

    /**
     * Part ID
     * Manufacturer-assigned part identifier
     */
    part_id?: string;

    /** Description */
    description?: string;

    /** Component type */
    component_type?: string | null;

    /**
     * Component id
     * @min 0
     * @max 9223372036854776000
     */
    component_id?: number | null;

    /** Component */
    component?: Record<string, string | null>;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** depth */
    _depth?: number;
  }

  export interface WritableInventoryItemTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device type */
    device_type: number;

    /** Parent */
    parent?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Role */
    role?: number | null;

    /** Manufacturer */
    manufacturer?: number | null;

    /**
     * Part ID
     * Manufacturer-assigned part identifier
     */
    part_id?: string;

    /** Description */
    description?: string;

    /** Component type */
    component_type?: string | null;

    /**
     * Component id
     * @min 0
     * @max 9223372036854776000
     */
    component_id?: number | null;

    /** Component */
    component?: Record<string, string | null>;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** depth */
    _depth?: number;
  }

  export interface InventoryItem {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device: NestedDevice;

    /** Parent */
    parent?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;
    role?: NestedInventoryItemRole;
    manufacturer?: NestedManufacturer;

    /**
     * Part ID
     * Manufacturer-assigned part identifier
     */
    part_id?: string;

    /** Serial number */
    serial?: string;

    /**
     * Asset tag
     * A unique tag used to identify this item
     */
    asset_tag?: string | null;

    /**
     * Discovered
     * This item was automatically discovered
     */
    discovered?: boolean;

    /** Description */
    description?: string;

    /** Component type */
    component_type?: string | null;

    /**
     * Component id
     * @min 0
     * @max 9223372036854776000
     */
    component_id?: number | null;

    /** Component */
    component?: Record<string, string | null>;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** depth */
    _depth?: number;
  }

  export interface WritableInventoryItem {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device */
    device: number;

    /** Parent */
    parent?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Role */
    role?: number | null;

    /** Manufacturer */
    manufacturer?: number | null;

    /**
     * Part ID
     * Manufacturer-assigned part identifier
     */
    part_id?: string;

    /** Serial number */
    serial?: string;

    /**
     * Asset tag
     * A unique tag used to identify this item
     */
    asset_tag?: string | null;

    /**
     * Discovered
     * This item was automatically discovered
     */
    discovered?: boolean;

    /** Description */
    description?: string;

    /** Component type */
    component_type?: string | null;

    /**
     * Component id
     * @min 0
     * @max 9223372036854776000
     */
    component_id?: number | null;

    /** Component */
    component?: Record<string, string | null>;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** depth */
    _depth?: number;
  }

  export interface Location {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;
    site: NestedSite;
    parent?: NestedLocation;
    tenant?: NestedTenant;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Rack count */
    rack_count?: number;

    /** Device count */
    device_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface WritableLocation {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Site */
    site: number;

    /** Parent */
    parent?: number | null;

    /** Tenant */
    tenant?: number | null;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Rack count */
    rack_count?: number;

    /** Device count */
    device_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface Manufacturer {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Devicetype count */
    devicetype_count?: number;

    /** Inventoryitem count */
    inventoryitem_count?: number;

    /** Platform count */
    platform_count?: number;
  }

  export interface ModuleBayTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device_type: NestedDeviceType;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /**
     * Position
     * Identifier to reference when renaming installed components
     */
    position?: string;

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableModuleBayTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device type */
    device_type: number;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /**
     * Position
     * Identifier to reference when renaming installed components
     */
    position?: string;

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface ModuleBay {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device: NestedDevice;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /**
     * Position
     * Identifier to reference when renaming installed components
     */
    position?: string;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableModuleBay {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device */
    device: number;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /**
     * Position
     * Identifier to reference when renaming installed components
     */
    position?: string;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface ModuleType {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    manufacturer: NestedManufacturer;

    /** Model */
    model: string;

    /**
     * Part number
     * Discrete part number (optional)
     */
    part_number?: string;

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableModuleType {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Manufacturer */
    manufacturer: number;

    /** Model */
    model: string;

    /**
     * Part number
     * Discrete part number (optional)
     */
    part_number?: string;

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface NestedModule {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device?: NestedDevice;
    module_bay?: ModuleNestedModuleBay;
    module_type?: NestedModuleType;
  }

  export interface NestedModuleBay {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    module?: NestedModule;

    /** Name */
    name: string;
  }

  export interface Module {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device: NestedDevice;
    module_bay: NestedModuleBay;
    module_type: NestedModuleType;

    /** Serial number */
    serial?: string;

    /**
     * Asset tag
     * A unique tag used to identify this device
     */
    asset_tag?: string | null;

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableModule {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device */
    device: number;

    /** Module bay */
    module_bay: number;

    /** Module type */
    module_type: number;

    /** Serial number */
    serial?: string;

    /**
     * Asset tag
     * A unique tag used to identify this device
     */
    asset_tag?: string | null;

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface Platform {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;
    manufacturer?: NestedManufacturer;

    /**
     * NAPALM driver
     * The name of the NAPALM driver to use when interacting with devices
     */
    napalm_driver?: string;

    /**
     * NAPALM arguments
     * Additional arguments to pass when initiating the NAPALM driver (JSON format)
     */
    napalm_args?: string | null;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Device count */
    device_count?: number;

    /** Virtualmachine count */
    virtualmachine_count?: number;
  }

  export interface WritablePlatform {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /**
     * Manufacturer
     * Optionally limit this platform to devices of a certain manufacturer
     */
    manufacturer?: number | null;

    /**
     * NAPALM driver
     * The name of the NAPALM driver to use when interacting with devices
     */
    napalm_driver?: string;

    /**
     * NAPALM arguments
     * Additional arguments to pass when initiating the NAPALM driver (JSON format)
     */
    napalm_args?: string | null;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Device count */
    device_count?: number;

    /** Virtualmachine count */
    virtualmachine_count?: number;
  }

  export interface NestedPowerPanel {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /** Powerfeed count */
    powerfeed_count?: number;
  }

  export interface PowerFeed {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    power_panel: NestedPowerPanel;
    rack?: NestedRack;

    /** Name */
    name: string;

    /** Status */
    status?: {
      label: "Offline" | "Active" | "Planned" | "Failed";
      value: "offline" | "active" | "planned" | "failed";
    };

    /** Type */
    type?: { label: "Primary" | "Redundant"; value: "primary" | "redundant" };

    /** Supply */
    supply?: { label: "AC" | "DC"; value: "ac" | "dc" };

    /** Phase */
    phase?: {
      label: "Single phase" | "Three-phase";
      value: "single-phase" | "three-phase";
    };

    /**
     * Voltage
     * @min -32768
     * @max 32767
     */
    voltage?: number;

    /**
     * Amperage
     * @min 1
     * @max 32767
     */
    amperage?: number;

    /**
     * Max utilization
     * Maximum permissible draw (percentage)
     * @min 1
     * @max 100
     */
    max_utilization?: number;

    /** Comments */
    comments?: string;

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;

    /**
     * Connected endpoint
     *
     * Return the appropriate serializer for the type of connected object.
     */
    connected_endpoint?: Record<string, string | null>;

    /** Connected endpoint type */
    connected_endpoint_type?: string;

    /** Connected endpoint reachable */
    connected_endpoint_reachable?: boolean;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** occupied */
    _occupied?: boolean;
  }

  export interface WritablePowerFeed {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Power panel */
    power_panel: number;

    /** Rack */
    rack?: number | null;

    /** Name */
    name: string;

    /** Status */
    status?: "offline" | "active" | "planned" | "failed";

    /** Type */
    type?: "primary" | "redundant";

    /** Supply */
    supply?: "ac" | "dc";

    /** Phase */
    phase?: "single-phase" | "three-phase";

    /**
     * Voltage
     * @min -32768
     * @max 32767
     */
    voltage?: number;

    /**
     * Amperage
     * @min 1
     * @max 32767
     */
    amperage?: number;

    /**
     * Max utilization
     * Maximum permissible draw (percentage)
     * @min 1
     * @max 100
     */
    max_utilization?: number;

    /** Comments */
    comments?: string;

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;

    /**
     * Connected endpoint
     *
     * Return the appropriate serializer for the type of connected object.
     */
    connected_endpoint?: Record<string, string | null>;

    /** Connected endpoint type */
    connected_endpoint_type?: string;

    /** Connected endpoint reachable */
    connected_endpoint_reachable?: boolean;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** occupied */
    _occupied?: boolean;
  }

  export interface NestedPowerPortTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;
  }

  export interface PowerOutletTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device_type?: NestedDeviceType;
    module_type?: NestedModuleType;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type?: {
      label:
        | "C5"
        | "C7"
        | "C13"
        | "C15"
        | "C19"
        | "C21"
        | "P+N+E 4H"
        | "P+N+E 6H"
        | "P+N+E 9H"
        | "2P+E 4H"
        | "2P+E 6H"
        | "2P+E 9H"
        | "3P+E 4H"
        | "3P+E 6H"
        | "3P+E 9H"
        | "3P+N+E 4H"
        | "3P+N+E 6H"
        | "3P+N+E 9H"
        | "NEMA 1-15R"
        | "NEMA 5-15R"
        | "NEMA 5-20R"
        | "NEMA 5-30R"
        | "NEMA 5-50R"
        | "NEMA 6-15R"
        | "NEMA 6-20R"
        | "NEMA 6-30R"
        | "NEMA 6-50R"
        | "NEMA 10-30R"
        | "NEMA 10-50R"
        | "NEMA 14-20R"
        | "NEMA 14-30R"
        | "NEMA 14-50R"
        | "NEMA 14-60R"
        | "NEMA 15-15R"
        | "NEMA 15-20R"
        | "NEMA 15-30R"
        | "NEMA 15-50R"
        | "NEMA 15-60R"
        | "NEMA L1-15R"
        | "NEMA L5-15R"
        | "NEMA L5-20R"
        | "NEMA L5-30R"
        | "NEMA L5-50R"
        | "NEMA L6-15R"
        | "NEMA L6-20R"
        | "NEMA L6-30R"
        | "NEMA L6-50R"
        | "NEMA L10-30R"
        | "NEMA L14-20R"
        | "NEMA L14-30R"
        | "NEMA L14-50R"
        | "NEMA L14-60R"
        | "NEMA L15-20R"
        | "NEMA L15-30R"
        | "NEMA L15-50R"
        | "NEMA L15-60R"
        | "NEMA L21-20R"
        | "NEMA L21-30R"
        | "NEMA L22-30R"
        | "CS6360C"
        | "CS6364C"
        | "CS8164C"
        | "CS8264C"
        | "CS8364C"
        | "CS8464C"
        | "ITA Type E (CEE 7/5)"
        | "ITA Type F (CEE 7/3)"
        | "ITA Type G (BS 1363)"
        | "ITA Type H"
        | "ITA Type I"
        | "ITA Type J"
        | "ITA Type K"
        | "ITA Type L (CEI 23-50)"
        | "ITA Type M (BS 546)"
        | "ITA Type N"
        | "ITA Type O"
        | "ITA Multistandard"
        | "USB Type A"
        | "USB Micro B"
        | "USB Type C"
        | "DC Terminal"
        | "HDOT Cx"
        | "Saf-D-Grid"
        | "Neutrik powerCON (20A)"
        | "Neutrik powerCON (32A)"
        | "Neutrik powerCON TRUE1"
        | "Neutrik powerCON TRUE1 TOP"
        | "Ubiquiti SmartPower"
        | "Hardwired"
        | "Other";
      value:
        | "iec-60320-c5"
        | "iec-60320-c7"
        | "iec-60320-c13"
        | "iec-60320-c15"
        | "iec-60320-c19"
        | "iec-60320-c21"
        | "iec-60309-p-n-e-4h"
        | "iec-60309-p-n-e-6h"
        | "iec-60309-p-n-e-9h"
        | "iec-60309-2p-e-4h"
        | "iec-60309-2p-e-6h"
        | "iec-60309-2p-e-9h"
        | "iec-60309-3p-e-4h"
        | "iec-60309-3p-e-6h"
        | "iec-60309-3p-e-9h"
        | "iec-60309-3p-n-e-4h"
        | "iec-60309-3p-n-e-6h"
        | "iec-60309-3p-n-e-9h"
        | "nema-1-15r"
        | "nema-5-15r"
        | "nema-5-20r"
        | "nema-5-30r"
        | "nema-5-50r"
        | "nema-6-15r"
        | "nema-6-20r"
        | "nema-6-30r"
        | "nema-6-50r"
        | "nema-10-30r"
        | "nema-10-50r"
        | "nema-14-20r"
        | "nema-14-30r"
        | "nema-14-50r"
        | "nema-14-60r"
        | "nema-15-15r"
        | "nema-15-20r"
        | "nema-15-30r"
        | "nema-15-50r"
        | "nema-15-60r"
        | "nema-l1-15r"
        | "nema-l5-15r"
        | "nema-l5-20r"
        | "nema-l5-30r"
        | "nema-l5-50r"
        | "nema-l6-15r"
        | "nema-l6-20r"
        | "nema-l6-30r"
        | "nema-l6-50r"
        | "nema-l10-30r"
        | "nema-l14-20r"
        | "nema-l14-30r"
        | "nema-l14-50r"
        | "nema-l14-60r"
        | "nema-l15-20r"
        | "nema-l15-30r"
        | "nema-l15-50r"
        | "nema-l15-60r"
        | "nema-l21-20r"
        | "nema-l21-30r"
        | "nema-l22-30r"
        | "CS6360C"
        | "CS6364C"
        | "CS8164C"
        | "CS8264C"
        | "CS8364C"
        | "CS8464C"
        | "ita-e"
        | "ita-f"
        | "ita-g"
        | "ita-h"
        | "ita-i"
        | "ita-j"
        | "ita-k"
        | "ita-l"
        | "ita-m"
        | "ita-n"
        | "ita-o"
        | "ita-multistandard"
        | "usb-a"
        | "usb-micro-b"
        | "usb-c"
        | "dc-terminal"
        | "hdot-cx"
        | "saf-d-grid"
        | "neutrik-powercon-20a"
        | "neutrik-powercon-32a"
        | "neutrik-powercon-true1"
        | "neutrik-powercon-true1-top"
        | "ubiquiti-smartpower"
        | "hardwired"
        | "other";
    };
    power_port?: NestedPowerPortTemplate;

    /** Feed leg */
    feed_leg?: { label: "A" | "B" | "C"; value: "A" | "B" | "C" };

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritablePowerOutletTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device type */
    device_type?: number | null;

    /** Module type */
    module_type?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type?:
      | "iec-60320-c5"
      | "iec-60320-c7"
      | "iec-60320-c13"
      | "iec-60320-c15"
      | "iec-60320-c19"
      | "iec-60320-c21"
      | "iec-60309-p-n-e-4h"
      | "iec-60309-p-n-e-6h"
      | "iec-60309-p-n-e-9h"
      | "iec-60309-2p-e-4h"
      | "iec-60309-2p-e-6h"
      | "iec-60309-2p-e-9h"
      | "iec-60309-3p-e-4h"
      | "iec-60309-3p-e-6h"
      | "iec-60309-3p-e-9h"
      | "iec-60309-3p-n-e-4h"
      | "iec-60309-3p-n-e-6h"
      | "iec-60309-3p-n-e-9h"
      | "nema-1-15r"
      | "nema-5-15r"
      | "nema-5-20r"
      | "nema-5-30r"
      | "nema-5-50r"
      | "nema-6-15r"
      | "nema-6-20r"
      | "nema-6-30r"
      | "nema-6-50r"
      | "nema-10-30r"
      | "nema-10-50r"
      | "nema-14-20r"
      | "nema-14-30r"
      | "nema-14-50r"
      | "nema-14-60r"
      | "nema-15-15r"
      | "nema-15-20r"
      | "nema-15-30r"
      | "nema-15-50r"
      | "nema-15-60r"
      | "nema-l1-15r"
      | "nema-l5-15r"
      | "nema-l5-20r"
      | "nema-l5-30r"
      | "nema-l5-50r"
      | "nema-l6-15r"
      | "nema-l6-20r"
      | "nema-l6-30r"
      | "nema-l6-50r"
      | "nema-l10-30r"
      | "nema-l14-20r"
      | "nema-l14-30r"
      | "nema-l14-50r"
      | "nema-l14-60r"
      | "nema-l15-20r"
      | "nema-l15-30r"
      | "nema-l15-50r"
      | "nema-l15-60r"
      | "nema-l21-20r"
      | "nema-l21-30r"
      | "nema-l22-30r"
      | "CS6360C"
      | "CS6364C"
      | "CS8164C"
      | "CS8264C"
      | "CS8364C"
      | "CS8464C"
      | "ita-e"
      | "ita-f"
      | "ita-g"
      | "ita-h"
      | "ita-i"
      | "ita-j"
      | "ita-k"
      | "ita-l"
      | "ita-m"
      | "ita-n"
      | "ita-o"
      | "ita-multistandard"
      | "usb-a"
      | "usb-micro-b"
      | "usb-c"
      | "dc-terminal"
      | "hdot-cx"
      | "saf-d-grid"
      | "neutrik-powercon-20a"
      | "neutrik-powercon-32a"
      | "neutrik-powercon-true1"
      | "neutrik-powercon-true1-top"
      | "ubiquiti-smartpower"
      | "hardwired"
      | "other";

    /** Power port */
    power_port?: number | null;

    /**
     * Feed leg
     * Phase (for three-phase feeds)
     */
    feed_leg?: "A" | "B" | "C";

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface NestedPowerPort {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device?: NestedDevice;

    /** Name */
    name: string;

    /** Cable */
    cable?: number | null;

    /** occupied */
    _occupied?: string;
  }

  export interface PowerOutlet {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device: NestedDevice;
    module?: ComponentNestedModule;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type?: {
      label:
        | "C5"
        | "C7"
        | "C13"
        | "C15"
        | "C19"
        | "C21"
        | "P+N+E 4H"
        | "P+N+E 6H"
        | "P+N+E 9H"
        | "2P+E 4H"
        | "2P+E 6H"
        | "2P+E 9H"
        | "3P+E 4H"
        | "3P+E 6H"
        | "3P+E 9H"
        | "3P+N+E 4H"
        | "3P+N+E 6H"
        | "3P+N+E 9H"
        | "NEMA 1-15R"
        | "NEMA 5-15R"
        | "NEMA 5-20R"
        | "NEMA 5-30R"
        | "NEMA 5-50R"
        | "NEMA 6-15R"
        | "NEMA 6-20R"
        | "NEMA 6-30R"
        | "NEMA 6-50R"
        | "NEMA 10-30R"
        | "NEMA 10-50R"
        | "NEMA 14-20R"
        | "NEMA 14-30R"
        | "NEMA 14-50R"
        | "NEMA 14-60R"
        | "NEMA 15-15R"
        | "NEMA 15-20R"
        | "NEMA 15-30R"
        | "NEMA 15-50R"
        | "NEMA 15-60R"
        | "NEMA L1-15R"
        | "NEMA L5-15R"
        | "NEMA L5-20R"
        | "NEMA L5-30R"
        | "NEMA L5-50R"
        | "NEMA L6-15R"
        | "NEMA L6-20R"
        | "NEMA L6-30R"
        | "NEMA L6-50R"
        | "NEMA L10-30R"
        | "NEMA L14-20R"
        | "NEMA L14-30R"
        | "NEMA L14-50R"
        | "NEMA L14-60R"
        | "NEMA L15-20R"
        | "NEMA L15-30R"
        | "NEMA L15-50R"
        | "NEMA L15-60R"
        | "NEMA L21-20R"
        | "NEMA L21-30R"
        | "NEMA L22-30R"
        | "CS6360C"
        | "CS6364C"
        | "CS8164C"
        | "CS8264C"
        | "CS8364C"
        | "CS8464C"
        | "ITA Type E (CEE 7/5)"
        | "ITA Type F (CEE 7/3)"
        | "ITA Type G (BS 1363)"
        | "ITA Type H"
        | "ITA Type I"
        | "ITA Type J"
        | "ITA Type K"
        | "ITA Type L (CEI 23-50)"
        | "ITA Type M (BS 546)"
        | "ITA Type N"
        | "ITA Type O"
        | "ITA Multistandard"
        | "USB Type A"
        | "USB Micro B"
        | "USB Type C"
        | "DC Terminal"
        | "HDOT Cx"
        | "Saf-D-Grid"
        | "Neutrik powerCON (20A)"
        | "Neutrik powerCON (32A)"
        | "Neutrik powerCON TRUE1"
        | "Neutrik powerCON TRUE1 TOP"
        | "Ubiquiti SmartPower"
        | "Hardwired"
        | "Other";
      value:
        | "iec-60320-c5"
        | "iec-60320-c7"
        | "iec-60320-c13"
        | "iec-60320-c15"
        | "iec-60320-c19"
        | "iec-60320-c21"
        | "iec-60309-p-n-e-4h"
        | "iec-60309-p-n-e-6h"
        | "iec-60309-p-n-e-9h"
        | "iec-60309-2p-e-4h"
        | "iec-60309-2p-e-6h"
        | "iec-60309-2p-e-9h"
        | "iec-60309-3p-e-4h"
        | "iec-60309-3p-e-6h"
        | "iec-60309-3p-e-9h"
        | "iec-60309-3p-n-e-4h"
        | "iec-60309-3p-n-e-6h"
        | "iec-60309-3p-n-e-9h"
        | "nema-1-15r"
        | "nema-5-15r"
        | "nema-5-20r"
        | "nema-5-30r"
        | "nema-5-50r"
        | "nema-6-15r"
        | "nema-6-20r"
        | "nema-6-30r"
        | "nema-6-50r"
        | "nema-10-30r"
        | "nema-10-50r"
        | "nema-14-20r"
        | "nema-14-30r"
        | "nema-14-50r"
        | "nema-14-60r"
        | "nema-15-15r"
        | "nema-15-20r"
        | "nema-15-30r"
        | "nema-15-50r"
        | "nema-15-60r"
        | "nema-l1-15r"
        | "nema-l5-15r"
        | "nema-l5-20r"
        | "nema-l5-30r"
        | "nema-l5-50r"
        | "nema-l6-15r"
        | "nema-l6-20r"
        | "nema-l6-30r"
        | "nema-l6-50r"
        | "nema-l10-30r"
        | "nema-l14-20r"
        | "nema-l14-30r"
        | "nema-l14-50r"
        | "nema-l14-60r"
        | "nema-l15-20r"
        | "nema-l15-30r"
        | "nema-l15-50r"
        | "nema-l15-60r"
        | "nema-l21-20r"
        | "nema-l21-30r"
        | "nema-l22-30r"
        | "CS6360C"
        | "CS6364C"
        | "CS8164C"
        | "CS8264C"
        | "CS8364C"
        | "CS8464C"
        | "ita-e"
        | "ita-f"
        | "ita-g"
        | "ita-h"
        | "ita-i"
        | "ita-j"
        | "ita-k"
        | "ita-l"
        | "ita-m"
        | "ita-n"
        | "ita-o"
        | "ita-multistandard"
        | "usb-a"
        | "usb-micro-b"
        | "usb-c"
        | "dc-terminal"
        | "hdot-cx"
        | "saf-d-grid"
        | "neutrik-powercon-20a"
        | "neutrik-powercon-32a"
        | "neutrik-powercon-true1"
        | "neutrik-powercon-true1-top"
        | "ubiquiti-smartpower"
        | "hardwired"
        | "other";
    };
    power_port?: NestedPowerPort;

    /** Feed leg */
    feed_leg?: { label: "A" | "B" | "C"; value: "A" | "B" | "C" };

    /** Description */
    description?: string;

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;

    /**
     * Connected endpoint
     *
     * Return the appropriate serializer for the type of connected object.
     */
    connected_endpoint?: Record<string, string | null>;

    /** Connected endpoint type */
    connected_endpoint_type?: string;

    /** Connected endpoint reachable */
    connected_endpoint_reachable?: boolean;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** occupied */
    _occupied?: boolean;
  }

  export interface WritablePowerOutlet {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device */
    device: number;

    /** Module */
    module?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /**
     * Type
     * Physical port type
     */
    type?:
      | "iec-60320-c5"
      | "iec-60320-c7"
      | "iec-60320-c13"
      | "iec-60320-c15"
      | "iec-60320-c19"
      | "iec-60320-c21"
      | "iec-60309-p-n-e-4h"
      | "iec-60309-p-n-e-6h"
      | "iec-60309-p-n-e-9h"
      | "iec-60309-2p-e-4h"
      | "iec-60309-2p-e-6h"
      | "iec-60309-2p-e-9h"
      | "iec-60309-3p-e-4h"
      | "iec-60309-3p-e-6h"
      | "iec-60309-3p-e-9h"
      | "iec-60309-3p-n-e-4h"
      | "iec-60309-3p-n-e-6h"
      | "iec-60309-3p-n-e-9h"
      | "nema-1-15r"
      | "nema-5-15r"
      | "nema-5-20r"
      | "nema-5-30r"
      | "nema-5-50r"
      | "nema-6-15r"
      | "nema-6-20r"
      | "nema-6-30r"
      | "nema-6-50r"
      | "nema-10-30r"
      | "nema-10-50r"
      | "nema-14-20r"
      | "nema-14-30r"
      | "nema-14-50r"
      | "nema-14-60r"
      | "nema-15-15r"
      | "nema-15-20r"
      | "nema-15-30r"
      | "nema-15-50r"
      | "nema-15-60r"
      | "nema-l1-15r"
      | "nema-l5-15r"
      | "nema-l5-20r"
      | "nema-l5-30r"
      | "nema-l5-50r"
      | "nema-l6-15r"
      | "nema-l6-20r"
      | "nema-l6-30r"
      | "nema-l6-50r"
      | "nema-l10-30r"
      | "nema-l14-20r"
      | "nema-l14-30r"
      | "nema-l14-50r"
      | "nema-l14-60r"
      | "nema-l15-20r"
      | "nema-l15-30r"
      | "nema-l15-50r"
      | "nema-l15-60r"
      | "nema-l21-20r"
      | "nema-l21-30r"
      | "nema-l22-30r"
      | "CS6360C"
      | "CS6364C"
      | "CS8164C"
      | "CS8264C"
      | "CS8364C"
      | "CS8464C"
      | "ita-e"
      | "ita-f"
      | "ita-g"
      | "ita-h"
      | "ita-i"
      | "ita-j"
      | "ita-k"
      | "ita-l"
      | "ita-m"
      | "ita-n"
      | "ita-o"
      | "ita-multistandard"
      | "usb-a"
      | "usb-micro-b"
      | "usb-c"
      | "dc-terminal"
      | "hdot-cx"
      | "saf-d-grid"
      | "neutrik-powercon-20a"
      | "neutrik-powercon-32a"
      | "neutrik-powercon-true1"
      | "neutrik-powercon-true1-top"
      | "ubiquiti-smartpower"
      | "hardwired"
      | "other";

    /** Power port */
    power_port?: number | null;

    /**
     * Feed leg
     * Phase (for three-phase feeds)
     */
    feed_leg?: "A" | "B" | "C";

    /** Description */
    description?: string;

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;

    /**
     * Connected endpoint
     *
     * Return the appropriate serializer for the type of connected object.
     */
    connected_endpoint?: Record<string, string | null>;

    /** Connected endpoint type */
    connected_endpoint_type?: string;

    /** Connected endpoint reachable */
    connected_endpoint_reachable?: boolean;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** occupied */
    _occupied?: boolean;
  }

  export interface PowerPanel {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    site: NestedSite;
    location?: NestedLocation;

    /** Name */
    name: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /** Powerfeed count */
    powerfeed_count?: number;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritablePowerPanel {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Site */
    site: number;

    /** Location */
    location?: number | null;

    /** Name */
    name: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /** Powerfeed count */
    powerfeed_count?: number;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface PowerPortTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device_type?: NestedDeviceType;
    module_type?: NestedModuleType;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type?: {
      label:
        | "C6"
        | "C8"
        | "C14"
        | "C16"
        | "C20"
        | "C22"
        | "P+N+E 4H"
        | "P+N+E 6H"
        | "P+N+E 9H"
        | "2P+E 4H"
        | "2P+E 6H"
        | "2P+E 9H"
        | "3P+E 4H"
        | "3P+E 6H"
        | "3P+E 9H"
        | "3P+N+E 4H"
        | "3P+N+E 6H"
        | "3P+N+E 9H"
        | "NEMA 1-15P"
        | "NEMA 5-15P"
        | "NEMA 5-20P"
        | "NEMA 5-30P"
        | "NEMA 5-50P"
        | "NEMA 6-15P"
        | "NEMA 6-20P"
        | "NEMA 6-30P"
        | "NEMA 6-50P"
        | "NEMA 10-30P"
        | "NEMA 10-50P"
        | "NEMA 14-20P"
        | "NEMA 14-30P"
        | "NEMA 14-50P"
        | "NEMA 14-60P"
        | "NEMA 15-15P"
        | "NEMA 15-20P"
        | "NEMA 15-30P"
        | "NEMA 15-50P"
        | "NEMA 15-60P"
        | "NEMA L1-15P"
        | "NEMA L5-15P"
        | "NEMA L5-20P"
        | "NEMA L5-30P"
        | "NEMA L5-50P"
        | "NEMA L6-15P"
        | "NEMA L6-20P"
        | "NEMA L6-30P"
        | "NEMA L6-50P"
        | "NEMA L10-30P"
        | "NEMA L14-20P"
        | "NEMA L14-30P"
        | "NEMA L14-50P"
        | "NEMA L14-60P"
        | "NEMA L15-20P"
        | "NEMA L15-30P"
        | "NEMA L15-50P"
        | "NEMA L15-60P"
        | "NEMA L21-20P"
        | "NEMA L21-30P"
        | "NEMA L22-30P"
        | "CS6361C"
        | "CS6365C"
        | "CS8165C"
        | "CS8265C"
        | "CS8365C"
        | "CS8465C"
        | "ITA Type C (CEE 7/16)"
        | "ITA Type E (CEE 7/6)"
        | "ITA Type F (CEE 7/4)"
        | "ITA Type E/F (CEE 7/7)"
        | "ITA Type G (BS 1363)"
        | "ITA Type H"
        | "ITA Type I"
        | "ITA Type J"
        | "ITA Type K"
        | "ITA Type L (CEI 23-50)"
        | "ITA Type M (BS 546)"
        | "ITA Type N"
        | "ITA Type O"
        | "USB Type A"
        | "USB Type B"
        | "USB Type C"
        | "USB Mini A"
        | "USB Mini B"
        | "USB Micro A"
        | "USB Micro B"
        | "USB Micro AB"
        | "USB 3.0 Type B"
        | "USB 3.0 Micro B"
        | "DC Terminal"
        | "Saf-D-Grid"
        | "Neutrik powerCON (20A)"
        | "Neutrik powerCON (32A)"
        | "Neutrik powerCON TRUE1"
        | "Neutrik powerCON TRUE1 TOP"
        | "Ubiquiti SmartPower"
        | "Hardwired"
        | "Other";
      value:
        | "iec-60320-c6"
        | "iec-60320-c8"
        | "iec-60320-c14"
        | "iec-60320-c16"
        | "iec-60320-c20"
        | "iec-60320-c22"
        | "iec-60309-p-n-e-4h"
        | "iec-60309-p-n-e-6h"
        | "iec-60309-p-n-e-9h"
        | "iec-60309-2p-e-4h"
        | "iec-60309-2p-e-6h"
        | "iec-60309-2p-e-9h"
        | "iec-60309-3p-e-4h"
        | "iec-60309-3p-e-6h"
        | "iec-60309-3p-e-9h"
        | "iec-60309-3p-n-e-4h"
        | "iec-60309-3p-n-e-6h"
        | "iec-60309-3p-n-e-9h"
        | "nema-1-15p"
        | "nema-5-15p"
        | "nema-5-20p"
        | "nema-5-30p"
        | "nema-5-50p"
        | "nema-6-15p"
        | "nema-6-20p"
        | "nema-6-30p"
        | "nema-6-50p"
        | "nema-10-30p"
        | "nema-10-50p"
        | "nema-14-20p"
        | "nema-14-30p"
        | "nema-14-50p"
        | "nema-14-60p"
        | "nema-15-15p"
        | "nema-15-20p"
        | "nema-15-30p"
        | "nema-15-50p"
        | "nema-15-60p"
        | "nema-l1-15p"
        | "nema-l5-15p"
        | "nema-l5-20p"
        | "nema-l5-30p"
        | "nema-l5-50p"
        | "nema-l6-15p"
        | "nema-l6-20p"
        | "nema-l6-30p"
        | "nema-l6-50p"
        | "nema-l10-30p"
        | "nema-l14-20p"
        | "nema-l14-30p"
        | "nema-l14-50p"
        | "nema-l14-60p"
        | "nema-l15-20p"
        | "nema-l15-30p"
        | "nema-l15-50p"
        | "nema-l15-60p"
        | "nema-l21-20p"
        | "nema-l21-30p"
        | "nema-l22-30p"
        | "cs6361c"
        | "cs6365c"
        | "cs8165c"
        | "cs8265c"
        | "cs8365c"
        | "cs8465c"
        | "ita-c"
        | "ita-e"
        | "ita-f"
        | "ita-ef"
        | "ita-g"
        | "ita-h"
        | "ita-i"
        | "ita-j"
        | "ita-k"
        | "ita-l"
        | "ita-m"
        | "ita-n"
        | "ita-o"
        | "usb-a"
        | "usb-b"
        | "usb-c"
        | "usb-mini-a"
        | "usb-mini-b"
        | "usb-micro-a"
        | "usb-micro-b"
        | "usb-micro-ab"
        | "usb-3-b"
        | "usb-3-micro-b"
        | "dc-terminal"
        | "saf-d-grid"
        | "neutrik-powercon-20"
        | "neutrik-powercon-32"
        | "neutrik-powercon-true1"
        | "neutrik-powercon-true1-top"
        | "ubiquiti-smartpower"
        | "hardwired"
        | "other";
    };

    /**
     * Maximum draw
     * Maximum power draw (watts)
     * @min 1
     * @max 32767
     */
    maximum_draw?: number | null;

    /**
     * Allocated draw
     * Allocated power draw (watts)
     * @min 1
     * @max 32767
     */
    allocated_draw?: number | null;

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritablePowerPortTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device type */
    device_type?: number | null;

    /** Module type */
    module_type?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type?:
      | "iec-60320-c6"
      | "iec-60320-c8"
      | "iec-60320-c14"
      | "iec-60320-c16"
      | "iec-60320-c20"
      | "iec-60320-c22"
      | "iec-60309-p-n-e-4h"
      | "iec-60309-p-n-e-6h"
      | "iec-60309-p-n-e-9h"
      | "iec-60309-2p-e-4h"
      | "iec-60309-2p-e-6h"
      | "iec-60309-2p-e-9h"
      | "iec-60309-3p-e-4h"
      | "iec-60309-3p-e-6h"
      | "iec-60309-3p-e-9h"
      | "iec-60309-3p-n-e-4h"
      | "iec-60309-3p-n-e-6h"
      | "iec-60309-3p-n-e-9h"
      | "nema-1-15p"
      | "nema-5-15p"
      | "nema-5-20p"
      | "nema-5-30p"
      | "nema-5-50p"
      | "nema-6-15p"
      | "nema-6-20p"
      | "nema-6-30p"
      | "nema-6-50p"
      | "nema-10-30p"
      | "nema-10-50p"
      | "nema-14-20p"
      | "nema-14-30p"
      | "nema-14-50p"
      | "nema-14-60p"
      | "nema-15-15p"
      | "nema-15-20p"
      | "nema-15-30p"
      | "nema-15-50p"
      | "nema-15-60p"
      | "nema-l1-15p"
      | "nema-l5-15p"
      | "nema-l5-20p"
      | "nema-l5-30p"
      | "nema-l5-50p"
      | "nema-l6-15p"
      | "nema-l6-20p"
      | "nema-l6-30p"
      | "nema-l6-50p"
      | "nema-l10-30p"
      | "nema-l14-20p"
      | "nema-l14-30p"
      | "nema-l14-50p"
      | "nema-l14-60p"
      | "nema-l15-20p"
      | "nema-l15-30p"
      | "nema-l15-50p"
      | "nema-l15-60p"
      | "nema-l21-20p"
      | "nema-l21-30p"
      | "nema-l22-30p"
      | "cs6361c"
      | "cs6365c"
      | "cs8165c"
      | "cs8265c"
      | "cs8365c"
      | "cs8465c"
      | "ita-c"
      | "ita-e"
      | "ita-f"
      | "ita-ef"
      | "ita-g"
      | "ita-h"
      | "ita-i"
      | "ita-j"
      | "ita-k"
      | "ita-l"
      | "ita-m"
      | "ita-n"
      | "ita-o"
      | "usb-a"
      | "usb-b"
      | "usb-c"
      | "usb-mini-a"
      | "usb-mini-b"
      | "usb-micro-a"
      | "usb-micro-b"
      | "usb-micro-ab"
      | "usb-3-b"
      | "usb-3-micro-b"
      | "dc-terminal"
      | "saf-d-grid"
      | "neutrik-powercon-20"
      | "neutrik-powercon-32"
      | "neutrik-powercon-true1"
      | "neutrik-powercon-true1-top"
      | "ubiquiti-smartpower"
      | "hardwired"
      | "other";

    /**
     * Maximum draw
     * Maximum power draw (watts)
     * @min 1
     * @max 32767
     */
    maximum_draw?: number | null;

    /**
     * Allocated draw
     * Allocated power draw (watts)
     * @min 1
     * @max 32767
     */
    allocated_draw?: number | null;

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface PowerPort {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device: NestedDevice;
    module?: ComponentNestedModule;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type?: {
      label:
        | "C6"
        | "C8"
        | "C14"
        | "C16"
        | "C20"
        | "C22"
        | "P+N+E 4H"
        | "P+N+E 6H"
        | "P+N+E 9H"
        | "2P+E 4H"
        | "2P+E 6H"
        | "2P+E 9H"
        | "3P+E 4H"
        | "3P+E 6H"
        | "3P+E 9H"
        | "3P+N+E 4H"
        | "3P+N+E 6H"
        | "3P+N+E 9H"
        | "NEMA 1-15P"
        | "NEMA 5-15P"
        | "NEMA 5-20P"
        | "NEMA 5-30P"
        | "NEMA 5-50P"
        | "NEMA 6-15P"
        | "NEMA 6-20P"
        | "NEMA 6-30P"
        | "NEMA 6-50P"
        | "NEMA 10-30P"
        | "NEMA 10-50P"
        | "NEMA 14-20P"
        | "NEMA 14-30P"
        | "NEMA 14-50P"
        | "NEMA 14-60P"
        | "NEMA 15-15P"
        | "NEMA 15-20P"
        | "NEMA 15-30P"
        | "NEMA 15-50P"
        | "NEMA 15-60P"
        | "NEMA L1-15P"
        | "NEMA L5-15P"
        | "NEMA L5-20P"
        | "NEMA L5-30P"
        | "NEMA L5-50P"
        | "NEMA L6-15P"
        | "NEMA L6-20P"
        | "NEMA L6-30P"
        | "NEMA L6-50P"
        | "NEMA L10-30P"
        | "NEMA L14-20P"
        | "NEMA L14-30P"
        | "NEMA L14-50P"
        | "NEMA L14-60P"
        | "NEMA L15-20P"
        | "NEMA L15-30P"
        | "NEMA L15-50P"
        | "NEMA L15-60P"
        | "NEMA L21-20P"
        | "NEMA L21-30P"
        | "NEMA L22-30P"
        | "CS6361C"
        | "CS6365C"
        | "CS8165C"
        | "CS8265C"
        | "CS8365C"
        | "CS8465C"
        | "ITA Type C (CEE 7/16)"
        | "ITA Type E (CEE 7/6)"
        | "ITA Type F (CEE 7/4)"
        | "ITA Type E/F (CEE 7/7)"
        | "ITA Type G (BS 1363)"
        | "ITA Type H"
        | "ITA Type I"
        | "ITA Type J"
        | "ITA Type K"
        | "ITA Type L (CEI 23-50)"
        | "ITA Type M (BS 546)"
        | "ITA Type N"
        | "ITA Type O"
        | "USB Type A"
        | "USB Type B"
        | "USB Type C"
        | "USB Mini A"
        | "USB Mini B"
        | "USB Micro A"
        | "USB Micro B"
        | "USB Micro AB"
        | "USB 3.0 Type B"
        | "USB 3.0 Micro B"
        | "DC Terminal"
        | "Saf-D-Grid"
        | "Neutrik powerCON (20A)"
        | "Neutrik powerCON (32A)"
        | "Neutrik powerCON TRUE1"
        | "Neutrik powerCON TRUE1 TOP"
        | "Ubiquiti SmartPower"
        | "Hardwired"
        | "Other";
      value:
        | "iec-60320-c6"
        | "iec-60320-c8"
        | "iec-60320-c14"
        | "iec-60320-c16"
        | "iec-60320-c20"
        | "iec-60320-c22"
        | "iec-60309-p-n-e-4h"
        | "iec-60309-p-n-e-6h"
        | "iec-60309-p-n-e-9h"
        | "iec-60309-2p-e-4h"
        | "iec-60309-2p-e-6h"
        | "iec-60309-2p-e-9h"
        | "iec-60309-3p-e-4h"
        | "iec-60309-3p-e-6h"
        | "iec-60309-3p-e-9h"
        | "iec-60309-3p-n-e-4h"
        | "iec-60309-3p-n-e-6h"
        | "iec-60309-3p-n-e-9h"
        | "nema-1-15p"
        | "nema-5-15p"
        | "nema-5-20p"
        | "nema-5-30p"
        | "nema-5-50p"
        | "nema-6-15p"
        | "nema-6-20p"
        | "nema-6-30p"
        | "nema-6-50p"
        | "nema-10-30p"
        | "nema-10-50p"
        | "nema-14-20p"
        | "nema-14-30p"
        | "nema-14-50p"
        | "nema-14-60p"
        | "nema-15-15p"
        | "nema-15-20p"
        | "nema-15-30p"
        | "nema-15-50p"
        | "nema-15-60p"
        | "nema-l1-15p"
        | "nema-l5-15p"
        | "nema-l5-20p"
        | "nema-l5-30p"
        | "nema-l5-50p"
        | "nema-l6-15p"
        | "nema-l6-20p"
        | "nema-l6-30p"
        | "nema-l6-50p"
        | "nema-l10-30p"
        | "nema-l14-20p"
        | "nema-l14-30p"
        | "nema-l14-50p"
        | "nema-l14-60p"
        | "nema-l15-20p"
        | "nema-l15-30p"
        | "nema-l15-50p"
        | "nema-l15-60p"
        | "nema-l21-20p"
        | "nema-l21-30p"
        | "nema-l22-30p"
        | "cs6361c"
        | "cs6365c"
        | "cs8165c"
        | "cs8265c"
        | "cs8365c"
        | "cs8465c"
        | "ita-c"
        | "ita-e"
        | "ita-f"
        | "ita-ef"
        | "ita-g"
        | "ita-h"
        | "ita-i"
        | "ita-j"
        | "ita-k"
        | "ita-l"
        | "ita-m"
        | "ita-n"
        | "ita-o"
        | "usb-a"
        | "usb-b"
        | "usb-c"
        | "usb-mini-a"
        | "usb-mini-b"
        | "usb-micro-a"
        | "usb-micro-b"
        | "usb-micro-ab"
        | "usb-3-b"
        | "usb-3-micro-b"
        | "dc-terminal"
        | "saf-d-grid"
        | "neutrik-powercon-20"
        | "neutrik-powercon-32"
        | "neutrik-powercon-true1"
        | "neutrik-powercon-true1-top"
        | "ubiquiti-smartpower"
        | "hardwired"
        | "other";
    };

    /**
     * Maximum draw
     * Maximum power draw (watts)
     * @min 1
     * @max 32767
     */
    maximum_draw?: number | null;

    /**
     * Allocated draw
     * Allocated power draw (watts)
     * @min 1
     * @max 32767
     */
    allocated_draw?: number | null;

    /** Description */
    description?: string;

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;

    /**
     * Connected endpoint
     *
     * Return the appropriate serializer for the type of connected object.
     */
    connected_endpoint?: Record<string, string | null>;

    /** Connected endpoint type */
    connected_endpoint_type?: string;

    /** Connected endpoint reachable */
    connected_endpoint_reachable?: boolean;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** occupied */
    _occupied?: boolean;
  }

  export interface WritablePowerPort {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device */
    device: number;

    /** Module */
    module?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /**
     * Type
     * Physical port type
     */
    type?:
      | "iec-60320-c6"
      | "iec-60320-c8"
      | "iec-60320-c14"
      | "iec-60320-c16"
      | "iec-60320-c20"
      | "iec-60320-c22"
      | "iec-60309-p-n-e-4h"
      | "iec-60309-p-n-e-6h"
      | "iec-60309-p-n-e-9h"
      | "iec-60309-2p-e-4h"
      | "iec-60309-2p-e-6h"
      | "iec-60309-2p-e-9h"
      | "iec-60309-3p-e-4h"
      | "iec-60309-3p-e-6h"
      | "iec-60309-3p-e-9h"
      | "iec-60309-3p-n-e-4h"
      | "iec-60309-3p-n-e-6h"
      | "iec-60309-3p-n-e-9h"
      | "nema-1-15p"
      | "nema-5-15p"
      | "nema-5-20p"
      | "nema-5-30p"
      | "nema-5-50p"
      | "nema-6-15p"
      | "nema-6-20p"
      | "nema-6-30p"
      | "nema-6-50p"
      | "nema-10-30p"
      | "nema-10-50p"
      | "nema-14-20p"
      | "nema-14-30p"
      | "nema-14-50p"
      | "nema-14-60p"
      | "nema-15-15p"
      | "nema-15-20p"
      | "nema-15-30p"
      | "nema-15-50p"
      | "nema-15-60p"
      | "nema-l1-15p"
      | "nema-l5-15p"
      | "nema-l5-20p"
      | "nema-l5-30p"
      | "nema-l5-50p"
      | "nema-l6-15p"
      | "nema-l6-20p"
      | "nema-l6-30p"
      | "nema-l6-50p"
      | "nema-l10-30p"
      | "nema-l14-20p"
      | "nema-l14-30p"
      | "nema-l14-50p"
      | "nema-l14-60p"
      | "nema-l15-20p"
      | "nema-l15-30p"
      | "nema-l15-50p"
      | "nema-l15-60p"
      | "nema-l21-20p"
      | "nema-l21-30p"
      | "nema-l22-30p"
      | "cs6361c"
      | "cs6365c"
      | "cs8165c"
      | "cs8265c"
      | "cs8365c"
      | "cs8465c"
      | "ita-c"
      | "ita-e"
      | "ita-f"
      | "ita-ef"
      | "ita-g"
      | "ita-h"
      | "ita-i"
      | "ita-j"
      | "ita-k"
      | "ita-l"
      | "ita-m"
      | "ita-n"
      | "ita-o"
      | "usb-a"
      | "usb-b"
      | "usb-c"
      | "usb-mini-a"
      | "usb-mini-b"
      | "usb-micro-a"
      | "usb-micro-b"
      | "usb-micro-ab"
      | "usb-3-b"
      | "usb-3-micro-b"
      | "dc-terminal"
      | "saf-d-grid"
      | "neutrik-powercon-20"
      | "neutrik-powercon-32"
      | "neutrik-powercon-true1"
      | "neutrik-powercon-true1-top"
      | "ubiquiti-smartpower"
      | "hardwired"
      | "other";

    /**
     * Maximum draw
     * Maximum power draw (watts)
     * @min 1
     * @max 32767
     */
    maximum_draw?: number | null;

    /**
     * Allocated draw
     * Allocated power draw (watts)
     * @min 1
     * @max 32767
     */
    allocated_draw?: number | null;

    /** Description */
    description?: string;

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;

    /**
     * Connected endpoint
     *
     * Return the appropriate serializer for the type of connected object.
     */
    connected_endpoint?: Record<string, string | null>;

    /** Connected endpoint type */
    connected_endpoint_type?: string;

    /** Connected endpoint reachable */
    connected_endpoint_reachable?: boolean;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** occupied */
    _occupied?: boolean;
  }

  export interface NestedUser {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /**
     * Username
     * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
     * @pattern ^[\w.@+-]+$
     */
    username: string;
  }

  export interface RackReservation {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    rack: NestedRack;
    units: number[];

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
    user: NestedUser;
    tenant?: NestedTenant;

    /** Description */
    description: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;
  }

  export interface WritableRackReservation {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Rack */
    rack: number;
    units: number[];

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** User */
    user: number;

    /** Tenant */
    tenant?: number | null;

    /** Description */
    description: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;
  }

  export interface RackRole {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /**
     * Color
     * @pattern ^[0-9a-f]{6}$
     */
    color?: string;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Rack count */
    rack_count?: number;
  }

  export interface NestedRackRole {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Rack count */
    rack_count?: number;
  }
  export interface NestedRackGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Rack count */
    rack_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface Rack {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    group?: NestedRackGroup;

    /** Facility ID */
    facility_id?: string | null;
    site: NestedSite;
    location?: NestedLocation;
    tenant?: NestedTenant;

    /** Status */
    status?: {
      label: "Reserved" | "Available" | "Planned" | "Active" | "Deprecated";
      value: "reserved" | "available" | "planned" | "active" | "deprecated";
    };
    role?: NestedRackRole;

    /** Serial number */
    serial?: string;

    /**
     * Asset tag
     * A unique tag used to identify this rack
     */
    asset_tag?: string | null;

    /** Type */
    type?: {
      label:
        | "2-post frame"
        | "4-post frame"
        | "4-post cabinet"
        | "Wall-mounted frame"
        | "Wall-mounted cabinet";
      value:
        | "2-post-frame"
        | "4-post-frame"
        | "4-post-cabinet"
        | "wall-frame"
        | "wall-cabinet";
    };

    /** Width */
    width?: {
      label: "10 inches" | "19 inches" | "21 inches" | "23 inches";
      value: 10 | 19 | 21 | 23;
    };

    /**
     * Height (U)
     * Height in rack units
     * @min 1
     * @max 100
     */
    u_height?: number;

    /**
     * Descending units
     * Units are numbered top-to-bottom
     */
    desc_units?: boolean;

    /**
     * Outer width
     * Outer dimension of rack (width)
     * @min 0
     * @max 32767
     */
    outer_width?: number | null;

    /**
     * Outer depth
     * Outer dimension of rack (depth)
     * @min 0
     * @max 32767
     */
    outer_depth?: number | null;

    /** Outer unit */
    outer_unit?: { label: "Millimeters" | "Inches"; value: "mm" | "in" };

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Device count */
    device_count?: number;

    /** Powerfeed count */
    powerfeed_count?: number;
  }

  export interface WritableRack {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /** Facility ID */
    facility_id?: string | null;

    /** Site */
    site: number;

    /** Location */
    location?: number | null;

    /** Tenant */
    tenant?: number | null;

    /** Status */
    status?: "reserved" | "available" | "planned" | "active" | "deprecated";

    /**
     * Role
     * Functional role
     */
    role?: number | null;

    /** Serial number */
    serial?: string;

    /**
     * Asset tag
     * A unique tag used to identify this rack
     */
    asset_tag?: string | null;

    /** Type */
    type?:
      | "2-post-frame"
      | "4-post-frame"
      | "4-post-cabinet"
      | "wall-frame"
      | "wall-cabinet";

    /**
     * Width
     * Rail-to-rail width
     */
    width?: 10 | 19 | 21 | 23;

    /**
     * Height (U)
     * Height in rack units
     * @min 1
     * @max 100
     */
    u_height?: number;

    /**
     * Descending units
     * Units are numbered top-to-bottom
     */
    desc_units?: boolean;

    /**
     * Outer width
     * Outer dimension of rack (width)
     * @min 0
     * @max 32767
     */
    outer_width?: number | null;

    /**
     * Outer depth
     * Outer dimension of rack (depth)
     * @min 0
     * @max 32767
     */
    outer_depth?: number | null;

    /** Outer unit */
    outer_unit?: "mm" | "in";

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Device count */
    device_count?: number;

    /** Powerfeed count */
    powerfeed_count?: number;
  }

  export interface RackUnit {
    /** Id */
    id?: number;

    /** Name */
    name?: string;

    /** Face */
    face?: { label: "Front" | "Rear"; value: "front" | "rear" };
    device?: NestedDevice;

    /** Occupied */
    occupied?: boolean;

    /** Display */
    display?: string;
  }

  export interface RearPortTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device_type?: NestedDeviceType;
    module_type?: NestedModuleType;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type: {
      label:
        | "8P8C"
        | "8P6C"
        | "8P4C"
        | "8P2C"
        | "6P6C"
        | "6P4C"
        | "6P2C"
        | "4P4C"
        | "4P2C"
        | "GG45"
        | "TERA 4P"
        | "TERA 2P"
        | "TERA 1P"
        | "110 Punch"
        | "BNC"
        | "F Connector"
        | "N Connector"
        | "MRJ21"
        | "FC"
        | "LC"
        | "LC/PC"
        | "LC/UPC"
        | "LC/APC"
        | "LSH"
        | "LSH/PC"
        | "LSH/UPC"
        | "LSH/APC"
        | "MPO"
        | "MTRJ"
        | "SC"
        | "SC/PC"
        | "SC/UPC"
        | "SC/APC"
        | "ST"
        | "CS"
        | "SN"
        | "SMA 905"
        | "SMA 906"
        | "URM-P2"
        | "URM-P4"
        | "URM-P8"
        | "Splice"
        | "Other";
      value:
        | "8p8c"
        | "8p6c"
        | "8p4c"
        | "8p2c"
        | "6p6c"
        | "6p4c"
        | "6p2c"
        | "4p4c"
        | "4p2c"
        | "gg45"
        | "tera-4p"
        | "tera-2p"
        | "tera-1p"
        | "110-punch"
        | "bnc"
        | "f"
        | "n"
        | "mrj21"
        | "fc"
        | "lc"
        | "lc-pc"
        | "lc-upc"
        | "lc-apc"
        | "lsh"
        | "lsh-pc"
        | "lsh-upc"
        | "lsh-apc"
        | "mpo"
        | "mtrj"
        | "sc"
        | "sc-pc"
        | "sc-upc"
        | "sc-apc"
        | "st"
        | "cs"
        | "sn"
        | "sma-905"
        | "sma-906"
        | "urm-p2"
        | "urm-p4"
        | "urm-p8"
        | "splice"
        | "other";
    };

    /**
     * Color
     * @pattern ^[0-9a-f]{6}$
     */
    color?: string;

    /**
     * Positions
     * @min 1
     * @max 1024
     */
    positions?: number;

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableRearPortTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device type */
    device_type?: number | null;

    /** Module type */
    module_type?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type:
      | "8p8c"
      | "8p6c"
      | "8p4c"
      | "8p2c"
      | "6p6c"
      | "6p4c"
      | "6p2c"
      | "4p4c"
      | "4p2c"
      | "gg45"
      | "tera-4p"
      | "tera-2p"
      | "tera-1p"
      | "110-punch"
      | "bnc"
      | "f"
      | "n"
      | "mrj21"
      | "fc"
      | "lc"
      | "lc-pc"
      | "lc-upc"
      | "lc-apc"
      | "lsh"
      | "lsh-pc"
      | "lsh-upc"
      | "lsh-apc"
      | "mpo"
      | "mtrj"
      | "sc"
      | "sc-pc"
      | "sc-upc"
      | "sc-apc"
      | "st"
      | "cs"
      | "sn"
      | "sma-905"
      | "sma-906"
      | "urm-p2"
      | "urm-p4"
      | "urm-p8"
      | "splice"
      | "other";

    /**
     * Color
     * @pattern ^[0-9a-f]{6}$
     */
    color?: string;

    /**
     * Positions
     * @min 1
     * @max 1024
     */
    positions?: number;

    /** Description */
    description?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface RearPort {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device: NestedDevice;
    module?: ComponentNestedModule;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type: {
      label:
        | "8P8C"
        | "8P6C"
        | "8P4C"
        | "8P2C"
        | "6P6C"
        | "6P4C"
        | "6P2C"
        | "4P4C"
        | "4P2C"
        | "GG45"
        | "TERA 4P"
        | "TERA 2P"
        | "TERA 1P"
        | "110 Punch"
        | "BNC"
        | "F Connector"
        | "N Connector"
        | "MRJ21"
        | "FC"
        | "LC"
        | "LC/PC"
        | "LC/UPC"
        | "LC/APC"
        | "LSH"
        | "LSH/PC"
        | "LSH/UPC"
        | "LSH/APC"
        | "MPO"
        | "MTRJ"
        | "SC"
        | "SC/PC"
        | "SC/UPC"
        | "SC/APC"
        | "ST"
        | "CS"
        | "SN"
        | "SMA 905"
        | "SMA 906"
        | "URM-P2"
        | "URM-P4"
        | "URM-P8"
        | "Splice"
        | "Other";
      value:
        | "8p8c"
        | "8p6c"
        | "8p4c"
        | "8p2c"
        | "6p6c"
        | "6p4c"
        | "6p2c"
        | "4p4c"
        | "4p2c"
        | "gg45"
        | "tera-4p"
        | "tera-2p"
        | "tera-1p"
        | "110-punch"
        | "bnc"
        | "f"
        | "n"
        | "mrj21"
        | "fc"
        | "lc"
        | "lc-pc"
        | "lc-upc"
        | "lc-apc"
        | "lsh"
        | "lsh-pc"
        | "lsh-upc"
        | "lsh-apc"
        | "mpo"
        | "mtrj"
        | "sc"
        | "sc-pc"
        | "sc-upc"
        | "sc-apc"
        | "st"
        | "cs"
        | "sn"
        | "sma-905"
        | "sma-906"
        | "urm-p2"
        | "urm-p4"
        | "urm-p8"
        | "splice"
        | "other";
    };

    /**
     * Color
     * @pattern ^[0-9a-f]{6}$
     */
    color?: string;

    /**
     * Positions
     * @min 1
     * @max 1024
     */
    positions?: number;

    /** Description */
    description?: string;

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** occupied */
    _occupied?: boolean;
  }

  export interface WritableRearPort {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device */
    device: number;

    /** Module */
    module?: number | null;

    /** Name */
    name: string;

    /**
     * Label
     * Physical label
     */
    label?: string;

    /** Type */
    type:
      | "8p8c"
      | "8p6c"
      | "8p4c"
      | "8p2c"
      | "6p6c"
      | "6p4c"
      | "6p2c"
      | "4p4c"
      | "4p2c"
      | "gg45"
      | "tera-4p"
      | "tera-2p"
      | "tera-1p"
      | "110-punch"
      | "bnc"
      | "f"
      | "n"
      | "mrj21"
      | "fc"
      | "lc"
      | "lc-pc"
      | "lc-upc"
      | "lc-apc"
      | "lsh"
      | "lsh-pc"
      | "lsh-upc"
      | "lsh-apc"
      | "mpo"
      | "mtrj"
      | "sc"
      | "sc-pc"
      | "sc-upc"
      | "sc-apc"
      | "st"
      | "cs"
      | "sn"
      | "sma-905"
      | "sma-906"
      | "urm-p2"
      | "urm-p4"
      | "urm-p8"
      | "splice"
      | "other";

    /**
     * Color
     * @pattern ^[0-9a-f]{6}$
     */
    color?: string;

    /**
     * Positions
     * @min 1
     * @max 1024
     */
    positions?: number;

    /** Description */
    description?: string;

    /**
     * Mark connected
     * Treat as if a cable is connected
     */
    mark_connected?: boolean;
    cable?: NestedCable;

    /**
     * Link peer
     *
     * Return the appropriate serializer for the link termination model.
     */
    link_peer?: Record<string, string | null>;

    /** Link peer type */
    link_peer_type?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** occupied */
    _occupied?: boolean;
  }

  export interface NestedRegion {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Site count */
    site_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface Region {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;
    parent?: NestedRegion;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Site count */
    site_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface WritableRegion {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Parent */
    parent?: number | null;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Site count */
    site_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface NestedSiteGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Site count */
    site_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface SiteGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;
    parent?: NestedSiteGroup;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Site count */
    site_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface WritableSiteGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Parent */
    parent?: number | null;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Site count */
    site_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface Site {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Status */
    status?: {
      label: "Planned" | "Staging" | "Active" | "Decommissioning" | "Retired";
      value: "planned" | "staging" | "active" | "decommissioning" | "retired";
    };
    region?: NestedRegion;
    group?: NestedSiteGroup;
    tenant?: NestedTenant;

    /**
     * Facility
     * Local facility ID or description
     */
    facility?: string;

    /** Time zone */
    time_zone?: string;

    /** Description */
    description?: string;

    /** Physical address */
    physical_address?: string;

    /** Shipping address */
    shipping_address?: string;

    /**
     * Latitude
     * GPS coordinate (latitude)
     * @format decimal
     */
    latitude?: number | null;

    /**
     * Longitude
     * GPS coordinate (longitude)
     * @format decimal
     */
    longitude?: number | null;

    /** Comments */
    comments?: string;
    asns?: NestedASN[];
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Circuit count */
    circuit_count?: number;

    /** Device count */
    device_count?: number;

    /** Prefix count */
    prefix_count?: number;

    /** Rack count */
    rack_count?: number;

    /** Virtualmachine count */
    virtualmachine_count?: number;

    /** Vlan count */
    vlan_count?: number;
  }

  export interface WritableSite {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Status */
    status?: "planned" | "staging" | "active" | "decommissioning" | "retired";

    /** Region */
    region?: number | null;

    /** Group */
    group?: number | null;

    /** Tenant */
    tenant?: number | null;

    /**
     * Facility
     * Local facility ID or description
     */
    facility?: string;

    /** Time zone */
    time_zone?: string;

    /** Description */
    description?: string;

    /** Physical address */
    physical_address?: string;

    /** Shipping address */
    shipping_address?: string;

    /**
     * Latitude
     * GPS coordinate (latitude)
     * @format decimal
     */
    latitude?: number | null;

    /**
     * Longitude
     * GPS coordinate (longitude)
     * @format decimal
     */
    longitude?: number | null;

    /** Comments */
    comments?: string;
    asns?: number[];
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Circuit count */
    circuit_count?: number;

    /** Device count */
    device_count?: number;

    /** Prefix count */
    prefix_count?: number;

    /** Rack count */
    rack_count?: number;

    /** Virtualmachine count */
    virtualmachine_count?: number;

    /** Vlan count */
    vlan_count?: number;
  }

  export interface VirtualChassis {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /** Domain */
    domain?: string;
    master?: NestedDevice;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /** Member count */
    member_count?: number;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableVirtualChassis {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /** Domain */
    domain?: string;

    /** Master */
    master?: number | null;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /** Member count */
    member_count?: number;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface NestedClusterType {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Cluster count */
    cluster_count?: number;
  }

  export interface NestedClusterGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Cluster count */
    cluster_count?: number;
  }

  export interface NestedTenantGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Tenant count */
    tenant_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface ConfigContext {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Weight
     * @min 0
     * @max 32767
     */
    weight?: number;

    /** Description */
    description?: string;

    /** Is active */
    is_active?: boolean;
    regions?: NestedRegion[];
    site_groups?: NestedSiteGroup[];
    sites?: NestedSite[];
    device_types?: NestedDeviceType[];
    roles?: NestedDeviceRole[];
    platforms?: NestedPlatform[];
    cluster_types?: NestedClusterType[];
    cluster_groups?: NestedClusterGroup[];
    clusters?: NestedCluster[];
    tenant_groups?: NestedTenantGroup[];
    tenants?: NestedTenant[];
    tags?: string[];

    /** Data */
    data: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableConfigContext {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Weight
     * @min 0
     * @max 32767
     */
    weight?: number;

    /** Description */
    description?: string;

    /** Is active */
    is_active?: boolean;
    regions?: number[];
    site_groups?: number[];
    sites?: number[];
    device_types?: number[];
    roles?: number[];
    platforms?: number[];
    cluster_types?: number[];
    cluster_groups?: number[];
    clusters?: number[];
    tenant_groups?: number[];
    tenants?: number[];
    tags?: string[];

    /** Data */
    data: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface ContentType {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** App label */
    app_label: string;

    /** Python model class name */
    model: string;
  }

  export interface CustomField {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    content_types: string[];

    /** Type */
    type: {
      label:
        | "Text"
        | "Text (long)"
        | "Integer"
        | "Boolean (true/false)"
        | "Date"
        | "URL"
        | "JSON"
        | "Selection"
        | "Multiple selection"
        | "Object"
        | "Multiple objects";
      value:
        | "text"
        | "longtext"
        | "integer"
        | "boolean"
        | "date"
        | "url"
        | "json"
        | "select"
        | "multiselect"
        | "object"
        | "multiobject";
    };

    /** Object type */
    object_type?: string;

    /** Data type */
    data_type?: string;

    /**
     * Name
     * Internal field name
     * @pattern ^[a-z0-9_]+$
     */
    name: string;

    /**
     * Label
     * Name of the field as displayed to users (if not provided, the field's name will be used)
     */
    label?: string;

    /** Description */
    description?: string;

    /**
     * Required
     * If true, this field is required when creating new objects or editing an existing object.
     */
    required?: boolean;

    /** Filter logic */
    filter_logic?: {
      label: "Disabled" | "Loose" | "Exact";
      value: "disabled" | "loose" | "exact";
    };

    /**
     * Default
     * Default value for the field (must be a JSON value). Encapsulate strings with double quotes (e.g. "Foo").
     */
    default?: string | null;

    /**
     * Weight
     * Fields with higher weights appear lower in a form.
     * @min 0
     * @max 32767
     */
    weight?: number;

    /**
     * Minimum value
     * Minimum allowed value (for numeric fields)
     * @min -2147483648
     * @max 2147483647
     */
    validation_minimum?: number | null;

    /**
     * Maximum value
     * Maximum allowed value (for numeric fields)
     * @min -2147483648
     * @max 2147483647
     */
    validation_maximum?: number | null;

    /**
     * Validation regex
     * Regular expression to enforce on text field values. Use ^ and $ to force matching of entire string. For example, <code>^[A-Z]{3}$</code> will limit values to exactly three uppercase letters.
     */
    validation_regex?: string;

    /** Comma-separated list of available choices (for selection fields) */
    choices?: string[] | null;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableCustomField {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    content_types: string[];

    /**
     * Type
     * The type of data this custom field holds
     */
    type?:
      | "text"
      | "longtext"
      | "integer"
      | "boolean"
      | "date"
      | "url"
      | "json"
      | "select"
      | "multiselect"
      | "object"
      | "multiobject";

    /** Object type */
    object_type?: string;

    /** Data type */
    data_type?: string;

    /**
     * Name
     * Internal field name
     * @pattern ^[a-z0-9_]+$
     */
    name: string;

    /**
     * Label
     * Name of the field as displayed to users (if not provided, the field's name will be used)
     */
    label?: string;

    /** Description */
    description?: string;

    /**
     * Required
     * If true, this field is required when creating new objects or editing an existing object.
     */
    required?: boolean;

    /**
     * Filter logic
     * Loose matches any instance of a given string; exact matches the entire field.
     */
    filter_logic?: "disabled" | "loose" | "exact";

    /**
     * Default
     * Default value for the field (must be a JSON value). Encapsulate strings with double quotes (e.g. "Foo").
     */
    default?: string | null;

    /**
     * Weight
     * Fields with higher weights appear lower in a form.
     * @min 0
     * @max 32767
     */
    weight?: number;

    /**
     * Minimum value
     * Minimum allowed value (for numeric fields)
     * @min -2147483648
     * @max 2147483647
     */
    validation_minimum?: number | null;

    /**
     * Maximum value
     * Maximum allowed value (for numeric fields)
     * @min -2147483648
     * @max 2147483647
     */
    validation_maximum?: number | null;

    /**
     * Validation regex
     * Regular expression to enforce on text field values. Use ^ and $ to force matching of entire string. For example, <code>^[A-Z]{3}$</code> will limit values to exactly three uppercase letters.
     */
    validation_regex?: string;

    /** Comma-separated list of available choices (for selection fields) */
    choices?: string[] | null;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface CustomLink {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Content type */
    content_type: string;

    /** Name */
    name: string;

    /** Enabled */
    enabled?: boolean;

    /**
     * Link text
     * Jinja2 template code for link text
     */
    link_text: string;

    /**
     * Link URL
     * Jinja2 template code for link URL
     */
    link_url: string;

    /**
     * Weight
     * @min 0
     * @max 32767
     */
    weight?: number;

    /**
     * Group name
     * Links with the same group will appear as a dropdown menu
     */
    group_name?: string;

    /**
     * Button class
     * The class of the first link in a group will be used for the dropdown button
     */
    button_class?:
      | "outline-dark"
      | "blue"
      | "indigo"
      | "purple"
      | "pink"
      | "red"
      | "orange"
      | "yellow"
      | "green"
      | "teal"
      | "cyan"
      | "gray"
      | "black"
      | "white"
      | "ghost-dark";

    /**
     * New window
     * Force link to open in a new window
     */
    new_window?: boolean;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface ExportTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Content type */
    content_type: string;

    /** Name */
    name: string;

    /** Description */
    description?: string;

    /**
     * Template code
     * Jinja2 template code. The list of objects being exported is passed as a context variable named <code>queryset</code>.
     */
    template_code: string;

    /**
     * MIME type
     * Defaults to <code>text/plain</code>
     */
    mime_type?: string;

    /**
     * File extension
     * Extension to append to the rendered filename
     */
    file_extension?: string;

    /**
     * As attachment
     * Download file as attachment
     */
    as_attachment?: boolean;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface ImageAttachment {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Content type */
    content_type: string;

    /**
     * Object id
     * @min 0
     * @max 9223372036854776000
     */
    object_id: number;

    /** Parent */
    parent?: Record<string, string | null>;

    /** Name */
    name?: string;

    /**
     * Image
     * @format uri
     */
    image?: string;

    /**
     * Image height
     * @min 0
     * @max 32767
     */
    image_height: number;

    /**
     * Image width
     * @min 0
     * @max 32767
     */
    image_width: number;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface JobResult {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Completed
     * @format date-time
     */
    completed?: string | null;

    /** Name */
    name: string;

    /** Obj type */
    obj_type?: string;

    /** Status */
    status?: {
      label: "Pending" | "Running" | "Completed" | "Errored" | "Failed";
      value: "pending" | "running" | "completed" | "errored" | "failed";
    };
    user?: NestedUser;

    /** Data */
    data?: string | null;

    /**
     * Job id
     * @format uuid
     */
    job_id: string;
  }

  export interface JournalEntry {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Assigned object type */
    assigned_object_type: string;

    /**
     * Assigned object id
     * @min 0
     * @max 9223372036854776000
     */
    assigned_object_id: number;

    /** Assigned object */
    assigned_object?: Record<string, string | null>;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /** Created by */
    created_by?: number | null;

    /** Kind */
    kind?: {
      label: "Info" | "Success" | "Warning" | "Danger";
      value: "info" | "success" | "warning" | "danger";
    };

    /** Comments */
    comments: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;
  }

  export interface WritableJournalEntry {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Assigned object type */
    assigned_object_type: string;

    /**
     * Assigned object id
     * @min 0
     * @max 9223372036854776000
     */
    assigned_object_id: number;

    /** Assigned object */
    assigned_object?: Record<string, string | null>;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /** Created by */
    created_by?: number | null;

    /** Kind */
    kind?: "info" | "success" | "warning" | "danger";

    /** Comments */
    comments: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;
  }

  export interface ObjectChange {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /**
     * Time
     * @format date-time
     */
    time?: string;
    user?: NestedUser;

    /** User name */
    user_name?: string;

    /**
     * Request id
     * @format uuid
     */
    request_id?: string;

    /** Action */
    action?: {
      label: "Created" | "Updated" | "Deleted";
      value: "create" | "update" | "delete";
    };

    /** Changed object type */
    changed_object_type?: string;

    /**
     * Changed object id
     * @min 0
     * @max 9223372036854776000
     */
    changed_object_id: number;

    /**
     * Changed object
     *
     * Serialize a nested representation of the changed object.
     */
    changed_object?: Record<string, string | null>;

    /** Prechange data */
    prechange_data?: string;

    /** Postchange data */
    postchange_data?: string;
  }

  export interface Tag {
    /** Id */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /**
     * Color
     * @pattern ^[0-9a-f]{6}$
     */
    color?: string;

    /** Description */
    description?: string;

    /** Tagged items */
    tagged_items?: number;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface Webhook {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    content_types: string[];

    /** Name */
    name: string;

    /**
     * Type create
     * Call this webhook when a matching object is created.
     */
    type_create?: boolean;

    /**
     * Type update
     * Call this webhook when a matching object is updated.
     */
    type_update?: boolean;

    /**
     * Type delete
     * Call this webhook when a matching object is deleted.
     */
    type_delete?: boolean;

    /**
     * URL
     * This URL will be called using the HTTP method defined when the webhook is called. Jinja2 template processing is supported with the same context as the request body.
     */
    payload_url: string;

    /** Enabled */
    enabled?: boolean;

    /** HTTP method */
    http_method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

    /**
     * HTTP content type
     * The complete list of official content types is available <a href="https://www.iana.org/assignments/media-types/media-types.xhtml">here</a>.
     */
    http_content_type?: string;

    /**
     * Additional headers
     * User-supplied HTTP headers to be sent with the request in addition to the HTTP content type. Headers should be defined in the format <code>Name: Value</code>. Jinja2 template processing is supported with the same context as the request body (below).
     */
    additional_headers?: string;

    /**
     * Body template
     * Jinja2 template for a custom request body. If blank, a JSON object representing the change will be included. Available context data includes: <code>event</code>, <code>model</code>, <code>timestamp</code>, <code>username</code>, <code>request_id</code>, and <code>data</code>.
     */
    body_template?: string;

    /**
     * Secret
     * When provided, the request will include a 'X-Hook-Signature' header containing a HMAC hex digest of the payload body using the secret as the key. The secret is not transmitted in the request.
     */
    secret?: string;

    /**
     * Conditions
     * A set of conditions which determine whether the webhook will be generated.
     */
    conditions?: string | null;

    /**
     * SSL verification
     * Enable SSL certificate verification. Disable with caution!
     */
    ssl_verification?: boolean;

    /**
     * CA File Path
     * The specific CA certificate file to use for SSL verification. Leave blank to use the system defaults.
     */
    ca_file_path?: string | null;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface NestedRIR {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Aggregate count */
    aggregate_count?: number;
  }

  export interface Aggregate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Family */
    family?: { label: "IPv4" | "IPv6"; value: 4 | 6 };

    /** Prefix */
    prefix: string;
    rir: NestedRIR;
    tenant?: NestedTenant;

    /**
     * Date added
     * @format date
     */
    date_added?: string | null;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableAggregate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Family */
    family?: string;

    /** Prefix */
    prefix: string;

    /** RIR */
    rir: number;

    /** Tenant */
    tenant?: number | null;

    /**
     * Date added
     * @format date
     */
    date_added?: string | null;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface ASN {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /**
     * ASN
     * 32-bit autonomous system number
     * @min 1
     * @max 4294967295
     */
    asn: number;

    /** RIR */
    rir: number;
    tenant?: NestedTenant;

    /** Description */
    description?: string;

    /** Site count */
    site_count?: number;

    /** Provider count */
    provider_count?: number;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableASN {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /**
     * ASN
     * 32-bit autonomous system number
     * @min 1
     * @max 4294967295
     */
    asn: number;

    /** RIR */
    rir: number;

    /** Tenant */
    tenant?: number | null;

    /** Description */
    description?: string;

    /** Site count */
    site_count?: number;

    /** Provider count */
    provider_count?: number;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface NestedFHRPGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Protocol */
    protocol:
      | "vrrp2"
      | "vrrp3"
      | "carp"
      | "clusterxl"
      | "hsrp"
      | "glbp"
      | "other";

    /**
     * Group ID
     * @min 0
     * @max 32767
     */
    group_id: number;
  }

  export interface FHRPGroupAssignment {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    group: NestedFHRPGroup;

    /** Interface type */
    interface_type: string;

    /**
     * Interface id
     * @min 0
     * @max 9223372036854776000
     */
    interface_id: number;

    /** Interface */
    interface?: Record<string, string | null>;

    /**
     * Priority
     * @min 0
     * @max 255
     */
    priority: number;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableFHRPGroupAssignment {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Group */
    group: number;

    /** Interface type */
    interface_type: string;

    /**
     * Interface id
     * @min 0
     * @max 9223372036854776000
     */
    interface_id: number;

    /** Interface */
    interface?: Record<string, string | null>;

    /**
     * Priority
     * @min 0
     * @max 255
     */
    priority: number;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface FHRPGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Protocol */
    protocol:
      | "vrrp2"
      | "vrrp3"
      | "carp"
      | "clusterxl"
      | "hsrp"
      | "glbp"
      | "other";

    /**
     * Group ID
     * @min 0
     * @max 32767
     */
    group_id: number;

    /** Authentication type */
    auth_type?: "plaintext" | "md5";

    /** Authentication key */
    auth_key?: string;

    /** Description */
    description?: string;
    ip_addresses?: NestedIPAddress[];
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface IPAddress {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Family */
    family?: { label: "IPv4" | "IPv6"; value: 4 | 6 };

    /**
     * Address
     * IPv4 or IPv6 address (with mask)
     */
    address: string;
    vrf?: NestedVRF;
    tenant?: NestedTenant;

    /** Status */
    status?: {
      label: "Active" | "Reserved" | "Deprecated" | "DHCP" | "SLAAC";
      value: "active" | "reserved" | "deprecated" | "dhcp" | "slaac";
    };

    /** Role */
    role?: {
      label:
        | "Loopback"
        | "Secondary"
        | "Anycast"
        | "VIP"
        | "VRRP"
        | "HSRP"
        | "GLBP"
        | "CARP";
      value:
        | "loopback"
        | "secondary"
        | "anycast"
        | "vip"
        | "vrrp"
        | "hsrp"
        | "glbp"
        | "carp";
    };

    /** Assigned object type */
    assigned_object_type?: string | null;

    /**
     * Assigned object id
     * @min 0
     * @max 9223372036854776000
     */
    assigned_object_id?: number | null;

    /** Assigned object */
    assigned_object?: Record<string, string | null>;
    nat_inside?: NestedIPAddress;
    nat_outside?: NestedIPAddress;

    /**
     * DNS Name
     * Hostname or FQDN (not case-sensitive)
     * @pattern ^([0-9A-Za-z_-]+|\*)(\.[0-9A-Za-z_-]+)*\.?$
     */
    dns_name?: string;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableIPAddress {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Family */
    family?: string;

    /**
     * Address
     * IPv4 or IPv6 address (with mask)
     */
    address: string;

    /** VRF */
    vrf?: number | null;

    /** Tenant */
    tenant?: number | null;

    /**
     * Status
     * The operational status of this IP
     */
    status?: "active" | "reserved" | "deprecated" | "dhcp" | "slaac";

    /**
     * Role
     * The functional role of this IP
     */
    role?:
      | "loopback"
      | "secondary"
      | "anycast"
      | "vip"
      | "vrrp"
      | "hsrp"
      | "glbp"
      | "carp";

    /** Assigned object type */
    assigned_object_type?: string | null;

    /**
     * Assigned object id
     * @min 0
     * @max 9223372036854776000
     */
    assigned_object_id?: number | null;

    /** Assigned object */
    assigned_object?: Record<string, string | null>;

    /**
     * NAT (Inside)
     * The IP for which this address is the "outside" IP
     */
    nat_inside?: number | null;

    /** Nat outside */
    nat_outside?: string;

    /**
     * DNS Name
     * Hostname or FQDN (not case-sensitive)
     * @pattern ^([0-9A-Za-z_-]+|\*)(\.[0-9A-Za-z_-]+)*\.?$
     */
    dns_name?: string;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface NestedRole {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Prefix count */
    prefix_count?: number;

    /** Vlan count */
    vlan_count?: number;
  }

  export interface IPRange {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Family */
    family?: { label: "IPv4" | "IPv6"; value: 4 | 6 };

    /**
     * Start address
     * IPv4 or IPv6 address (with mask)
     */
    start_address: string;

    /**
     * End address
     * IPv4 or IPv6 address (with mask)
     */
    end_address: string;

    /** Size */
    size?: number;
    vrf?: NestedVRF;
    tenant?: NestedTenant;

    /** Status */
    status?: {
      label: "Active" | "Reserved" | "Deprecated";
      value: "active" | "reserved" | "deprecated";
    };
    role?: NestedRole;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Children */
    children?: number;
  }

  export interface WritableIPRange {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Family */
    family?: string;

    /**
     * Start address
     * IPv4 or IPv6 address (with mask)
     */
    start_address: string;

    /**
     * End address
     * IPv4 or IPv6 address (with mask)
     */
    end_address: string;

    /** Size */
    size?: number;

    /** VRF */
    vrf?: number | null;

    /** Tenant */
    tenant?: number | null;

    /**
     * Status
     * Operational status of this range
     */
    status?: "active" | "reserved" | "deprecated";

    /**
     * Role
     * The primary function of this range
     */
    role?: number | null;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Children */
    children?: number;
  }

  export interface AvailableIP {
    /** Family */
    family?: number;

    /** Address */
    address?: string;
    vrf?: NestedVRF;
  }

  export interface WritableAvailableIP {
    /** Family */
    family?: number;

    /** Address */
    address?: string;
  }

  export interface Prefix {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Family */
    family?: { label: "IPv4" | "IPv6"; value: 4 | 6 };

    /**
     * Prefix
     * IPv4 or IPv6 network with mask
     */
    prefix: string;
    site?: NestedSite;
    vrf?: NestedVRF;
    tenant?: NestedTenant;
    vlan?: NestedVLAN;

    /** Status */
    status?: {
      label: "Container" | "Active" | "Reserved" | "Deprecated";
      value: "container" | "active" | "reserved" | "deprecated";
    };
    role?: NestedRole;

    /**
     * Is a pool
     * All IP addresses within this prefix are considered usable
     */
    is_pool?: boolean;

    /**
     * Mark utilized
     * Treat as 100% utilized
     */
    mark_utilized?: boolean;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Children */
    children?: number;

    /** depth */
    _depth?: number;
  }

  export interface WritablePrefix {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Family */
    family?: string;

    /**
     * Prefix
     * IPv4 or IPv6 network with mask
     */
    prefix: string;

    /** Site */
    site?: number | null;

    /** VRF */
    vrf?: number | null;

    /** Tenant */
    tenant?: number | null;

    /** VLAN */
    vlan?: number | null;

    /**
     * Status
     * Operational status of this prefix
     */
    status?: "container" | "active" | "reserved" | "deprecated";

    /**
     * Role
     * The primary function of this prefix
     */
    role?: number | null;

    /**
     * Is a pool
     * All IP addresses within this prefix are considered usable
     */
    is_pool?: boolean;

    /**
     * Mark utilized
     * Treat as 100% utilized
     */
    mark_utilized?: boolean;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Children */
    children?: number;

    /** depth */
    _depth?: number;
  }

  export interface AvailablePrefix {
    /** Family */
    family?: number;

    /** Prefix */
    prefix?: string;
    vrf?: NestedVRF;
  }

  export interface PrefixLength {
    /** Prefix length */
    prefix_length: number;
  }

  export interface RIR {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /**
     * Private
     * IP space managed by this RIR is considered private
     */
    is_private?: boolean;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Aggregate count */
    aggregate_count?: number;
  }

  export interface Role {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /**
     * Weight
     * @min 0
     * @max 32767
     */
    weight?: number;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Prefix count */
    prefix_count?: number;

    /** Vlan count */
    vlan_count?: number;
  }

  export interface RouteTarget {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /**
     * Name
     * Route target value (formatted in accordance with RFC 4360)
     */
    name: string;
    tenant?: NestedTenant;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableRouteTarget {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /**
     * Name
     * Route target value (formatted in accordance with RFC 4360)
     */
    name: string;

    /** Tenant */
    tenant?: number | null;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface ServiceTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;
    ports: number[];

    /** Protocol */
    protocol?: { label: "TCP" | "UDP" | "SCTP"; value: "tcp" | "udp" | "sctp" };

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableServiceTemplate {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;
    ports: number[];

    /** Protocol */
    protocol: "tcp" | "udp" | "sctp";

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface NestedVirtualMachine {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;
  }

  export interface Service {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    device?: NestedDevice;
    virtual_machine?: NestedVirtualMachine;

    /** Name */
    name: string;
    ports: number[];

    /** Protocol */
    protocol?: { label: "TCP" | "UDP" | "SCTP"; value: "tcp" | "udp" | "sctp" };
    ipaddresses?: NestedIPAddress[];

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableService {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Device */
    device?: number | null;

    /** Virtual machine */
    virtual_machine?: number | null;

    /** Name */
    name: string;
    ports: number[];

    /** Protocol */
    protocol: "tcp" | "udp" | "sctp";
    ipaddresses?: number[];

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface VLANGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Scope type */
    scope_type?: string;

    /** Scope id */
    scope_id?: number | null;

    /** Scope */
    scope?: string;

    /**
     * Minimum VLAN ID
     * Lowest permissible ID of a child VLAN
     * @min 1
     * @max 4094
     */
    min_vid?: number;

    /**
     * Maximum VLAN ID
     * Highest permissible ID of a child VLAN
     * @min 1
     * @max 4094
     */
    max_vid?: number;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Vlan count */
    vlan_count?: number;
  }

  export interface NestedVLANGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Vlan count */
    vlan_count?: number;
  }

  export interface AvailableVLAN {
    /** Vid */
    vid?: number;
    group?: NestedVLANGroup;
  }

  export interface WritableCreateAvailableVLAN {
    /** Name */
    name: string;

    /** Site */
    site?: number | null;

    /** Tenant */
    tenant?: number | null;

    /** Status */
    status?: "active" | "reserved" | "deprecated";

    /** Role */
    role?: number | null;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;
  }

  export interface VLAN {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    site?: NestedSite;
    group?: NestedVLANGroup;

    /**
     * ID
     * @min 1
     * @max 4094
     */
    vid: number;

    /** Name */
    name: string;
    tenant?: NestedTenant;

    /** Status */
    status?: {
      label: "Active" | "Reserved" | "Deprecated";
      value: "active" | "reserved" | "deprecated";
    };
    role?: NestedRole;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Prefix count */
    prefix_count?: number;
  }

  export interface WritableVLAN {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Site */
    site?: number | null;

    /** Group */
    group?: number | null;

    /**
     * ID
     * @min 1
     * @max 4094
     */
    vid: number;

    /** Name */
    name: string;

    /** Tenant */
    tenant?: number | null;

    /** Status */
    status?: "active" | "reserved" | "deprecated";

    /** Role */
    role?: number | null;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Prefix count */
    prefix_count?: number;
  }

  export interface NestedRouteTarget {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /**
     * Name
     * Route target value (formatted in accordance with RFC 4360)
     */
    name: string;
  }

  export interface VRF {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Route distinguisher
     * Unique route distinguisher (as defined in RFC 4364)
     */
    rd?: string | null;
    tenant?: NestedTenant;

    /**
     * Enforce unique space
     * Prevent duplicate prefixes/IP addresses within this VRF
     */
    enforce_unique?: boolean;

    /** Description */
    description?: string;
    import_targets?: NestedRouteTarget[];
    export_targets?: NestedRouteTarget[];
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Ipaddress count */
    ipaddress_count?: number;

    /** Prefix count */
    prefix_count?: number;
  }

  export interface WritableVRF {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Route distinguisher
     * Unique route distinguisher (as defined in RFC 4364)
     */
    rd?: string | null;

    /** Tenant */
    tenant?: number | null;

    /**
     * Enforce unique space
     * Prevent duplicate prefixes/IP addresses within this VRF
     */
    enforce_unique?: boolean;

    /** Description */
    description?: string;
    import_targets?: number[];
    export_targets?: number[];
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Ipaddress count */
    ipaddress_count?: number;

    /** Prefix count */
    prefix_count?: number;
  }

  export interface NestedContact {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;
  }

  export interface NestedContactRole {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;
  }

  export interface ContactAssignment {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Content type */
    content_type: string;

    /**
     * Object id
     * @min 0
     * @max 9223372036854776000
     */
    object_id: number;

    /** Object */
    object?: Record<string, string | null>;
    contact: NestedContact;
    role?: NestedContactRole;

    /** Priority */
    priority?: {
      label: "Primary" | "Secondary" | "Tertiary" | "Inactive";
      value: "primary" | "secondary" | "tertiary" | "inactive";
    };

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableContactAssignment {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Content type */
    content_type: string;

    /**
     * Object id
     * @min 0
     * @max 9223372036854776000
     */
    object_id: number;

    /** Object */
    object?: Record<string, string | null>;

    /** Contact */
    contact: number;

    /** Role */
    role: number;

    /** Priority */
    priority: "primary" | "secondary" | "tertiary" | "inactive";

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface NestedContactGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Contact count */
    contact_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface ContactGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;
    parent?: NestedContactGroup;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Contact count */
    contact_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface WritableContactGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Parent */
    parent?: number | null;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Contact count */
    contact_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface ContactRole {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface Contact {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    group?: NestedContactGroup;

    /** Name */
    name: string;

    /** Title */
    title?: string;

    /** Phone */
    phone?: string;

    /**
     * Email
     * @format email
     */
    email?: string;

    /** Address */
    address?: string;

    /**
     * Link
     * @format uri
     */
    link?: string;

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableContact {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Group */
    group?: number | null;

    /** Name */
    name: string;

    /** Title */
    title?: string;

    /** Phone */
    phone?: string;

    /**
     * Email
     * @format email
     */
    email?: string;

    /** Address */
    address?: string;

    /**
     * Link
     * @format uri
     */
    link?: string;

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface TenantGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;
    parent?: NestedTenantGroup;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Tenant count */
    tenant_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface WritableTenantGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Parent */
    parent?: number | null;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Tenant count */
    tenant_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface Tenant {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;
    group?: NestedTenantGroup;

    /** Description */
    description?: string;

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Circuit count */
    circuit_count?: number;

    /** Device count */
    device_count?: number;

    /** Ipaddress count */
    ipaddress_count?: number;

    /** Prefix count */
    prefix_count?: number;

    /** Rack count */
    rack_count?: number;

    /** Site count */
    site_count?: number;

    /** Virtualmachine count */
    virtualmachine_count?: number;

    /** Vlan count */
    vlan_count?: number;

    /** Vrf count */
    vrf_count?: number;

    /** Cluster count */
    cluster_count?: number;
  }

  export interface WritableTenant {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Group */
    group?: number | null;

    /** Description */
    description?: string;

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Circuit count */
    circuit_count?: number;

    /** Device count */
    device_count?: number;

    /** Ipaddress count */
    ipaddress_count?: number;

    /** Prefix count */
    prefix_count?: number;

    /** Rack count */
    rack_count?: number;

    /** Site count */
    site_count?: number;

    /** Virtualmachine count */
    virtualmachine_count?: number;

    /** Vlan count */
    vlan_count?: number;

    /** Vrf count */
    vrf_count?: number;

    /** Cluster count */
    cluster_count?: number;
  }

  export interface Group {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /** User count */
    user_count?: number;
  }

  export interface NestedGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;
  }

  export interface ObjectPermission {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /** Description */
    description?: string;

    /** Enabled */
    enabled?: boolean;
    object_types: string[];
    groups?: NestedGroup[];
    users?: NestedUser[];

    /** The list of actions granted by this permission */
    actions: string[];

    /**
     * Constraints
     * Queryset filter matching the applicable objects of the selected type(s)
     */
    constraints?: string | null;
  }

  export interface WritableObjectPermission {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /** Description */
    description?: string;

    /** Enabled */
    enabled?: boolean;
    object_types: string[];
    groups?: number[];
    users?: number[];

    /** The list of actions granted by this permission */
    actions: string[];

    /**
     * Constraints
     * Queryset filter matching the applicable objects of the selected type(s)
     */
    constraints?: string | null;
  }

  export interface Token {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    user: NestedUser;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Expires
     * @format date-time
     */
    expires?: string | null;

    /** Key */
    key?: string;

    /**
     * Write enabled
     * Permit create/update/delete operations using this key
     */
    write_enabled?: boolean;

    /** Description */
    description?: string;
  }

  export interface WritableToken {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** User */
    user: number;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Expires
     * @format date-time
     */
    expires?: string | null;

    /** Key */
    key?: string;

    /**
     * Write enabled
     * Permit create/update/delete operations using this key
     */
    write_enabled?: boolean;

    /** Description */
    description?: string;
  }

  export interface User {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /**
     * Username
     * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
     * @pattern ^[\w.@+-]+$
     */
    username: string;

    /** Password */
    password: string;

    /** First name */
    first_name?: string;

    /** Last name */
    last_name?: string;

    /**
     * Email address
     * @format email
     */
    email?: string;

    /**
     * Staff status
     * Designates whether the user can log into this admin site.
     */
    is_staff?: boolean;

    /**
     * Active
     * Designates whether this user should be treated as active. Unselect this instead of deleting accounts.
     */
    is_active?: boolean;

    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;
    groups?: NestedGroup[];
  }

  export interface WritableUser {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /**
     * Username
     * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
     * @pattern ^[\w.@+-]+$
     */
    username: string;

    /** Password */
    password: string;

    /** First name */
    first_name?: string;

    /** Last name */
    last_name?: string;

    /**
     * Email address
     * @format email
     */
    email?: string;

    /**
     * Staff status
     * Designates whether the user can log into this admin site.
     */
    is_staff?: boolean;

    /**
     * Active
     * Designates whether this user should be treated as active. Unselect this instead of deleting accounts.
     */
    is_active?: boolean;

    /**
     * Date joined
     * @format date-time
     */
    date_joined?: string;

    /** The groups this user belongs to. A user will get all permissions granted to each of their groups. */
    groups?: number[];
  }

  export interface ClusterGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Cluster count */
    cluster_count?: number;
  }

  export interface ClusterType {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Cluster count */
    cluster_count?: number;
  }

  export interface Cluster {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;
    type: NestedClusterType;
    group?: NestedClusterGroup;
    tenant?: NestedTenant;
    site?: NestedSite;

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Device count */
    device_count?: number;

    /** Virtualmachine count */
    virtualmachine_count?: number;
  }

  export interface WritableCluster {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /** Type */
    type: number;

    /** Group */
    group?: number | null;

    /** Tenant */
    tenant?: number | null;

    /** Site */
    site?: number | null;

    /** Comments */
    comments?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Device count */
    device_count?: number;

    /** Virtualmachine count */
    virtualmachine_count?: number;
  }

  export interface NestedVMInterface {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    virtual_machine?: NestedVirtualMachine;

    /** Name */
    name: string;
  }

  export interface VMInterface {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    virtual_machine: NestedVirtualMachine;

    /** Name */
    name: string;

    /** Enabled */
    enabled?: boolean;
    parent?: NestedVMInterface;
    bridge?: NestedVMInterface;

    /**
     * MTU
     * @min 1
     * @max 65536
     */
    mtu?: number | null;

    /** MAC Address */
    mac_address?: string | null;

    /** Description */
    description?: string;

    /** Mode */
    mode?: {
      label: "Access" | "Tagged" | "Tagged (All)";
      value: "access" | "tagged" | "tagged-all";
    };
    untagged_vlan?: NestedVLAN;
    tagged_vlans?: NestedVLAN[];
    vrf?: NestedVRF;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Count ipaddresses */
    count_ipaddresses?: number;

    /** Count fhrp groups */
    count_fhrp_groups?: number;
  }

  export interface WritableVMInterface {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Virtual machine */
    virtual_machine: number;

    /** Name */
    name: string;

    /** Enabled */
    enabled?: boolean;

    /** Parent interface */
    parent?: number | null;

    /** Bridge interface */
    bridge?: number | null;

    /**
     * MTU
     * @min 1
     * @max 65536
     */
    mtu?: number | null;

    /** MAC Address */
    mac_address?: string | null;

    /** Description */
    description?: string;

    /** Mode */
    mode?: "access" | "tagged" | "tagged-all";

    /** Untagged VLAN */
    untagged_vlan?: number | null;
    tagged_vlans?: number[];

    /** VRF */
    vrf?: number | null;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Count ipaddresses */
    count_ipaddresses?: number;

    /** Count fhrp groups */
    count_fhrp_groups?: number;
  }

  export interface VirtualMachineWithConfigContext {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /** Status */
    status?: {
      label:
        | "Offline"
        | "Active"
        | "Planned"
        | "Staged"
        | "Failed"
        | "Decommissioning";
      value:
        | "offline"
        | "active"
        | "planned"
        | "staged"
        | "failed"
        | "decommissioning";
    };
    site?: NestedSite;
    cluster: NestedCluster;
    role?: NestedDeviceRole;
    tenant?: NestedTenant;
    platform?: NestedPlatform;
    primary_ip?: NestedIPAddress;
    primary_ip4?: NestedIPAddress;
    primary_ip6?: NestedIPAddress;

    /**
     * VCPUs
     * @format decimal
     * @min 0.01
     */
    vcpus?: number | null;

    /**
     * Memory (MB)
     * @min 0
     * @max 2147483647
     */
    memory?: number | null;

    /**
     * Disk (GB)
     * @min 0
     * @max 2147483647
     */
    disk?: number | null;

    /** Comments */
    comments?: string;

    /** Local context data */
    local_context_data?: string | null;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /** Config context */
    config_context?: Record<string, string | null>;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableVirtualMachineWithConfigContext {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /** Status */
    status?:
      | "offline"
      | "active"
      | "planned"
      | "staged"
      | "failed"
      | "decommissioning";

    /** Site */
    site?: string;

    /** Cluster */
    cluster: number;

    /** Role */
    role?: number | null;

    /** Tenant */
    tenant?: number | null;

    /** Platform */
    platform?: number | null;

    /** Primary ip */
    primary_ip?: string;

    /** Primary IPv4 */
    primary_ip4?: number | null;

    /** Primary IPv6 */
    primary_ip6?: number | null;

    /**
     * VCPUs
     * @format decimal
     * @min 0.01
     */
    vcpus?: number | null;

    /**
     * Memory (MB)
     * @min 0
     * @max 2147483647
     */
    memory?: number | null;

    /**
     * Disk (GB)
     * @min 0
     * @max 2147483647
     */
    disk?: number | null;

    /** Comments */
    comments?: string;

    /** Local context data */
    local_context_data?: string | null;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /** Config context */
    config_context?: Record<string, string | null>;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface NestedWirelessLANGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Wirelesslan count */
    wirelesslan_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface WirelessLANGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;
    parent?: NestedWirelessLANGroup;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Wirelesslan count */
    wirelesslan_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface WritableWirelessLANGroup {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Name */
    name: string;

    /**
     * Slug
     * @format slug
     * @pattern ^[-a-zA-Z0-9_]+$
     */
    slug: string;

    /** Parent */
    parent?: number | null;

    /** Description */
    description?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;

    /** Wirelesslan count */
    wirelesslan_count?: number;

    /** depth */
    _depth?: number;
  }

  export interface WirelessLAN {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** SSID */
    ssid: string;

    /** Description */
    description?: string;
    group?: NestedWirelessLANGroup;
    vlan?: NestedVLAN;

    /** Auth type */
    auth_type?: {
      label: "Open" | "WEP" | "WPA Personal (PSK)" | "WPA Enterprise";
      value: "open" | "wep" | "wpa-personal" | "wpa-enterprise";
    };

    /** Auth cipher */
    auth_cipher?: {
      label: "Auto" | "TKIP" | "AES";
      value: "auto" | "tkip" | "aes";
    };

    /** Pre-shared key */
    auth_psk?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableWirelessLAN {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** SSID */
    ssid: string;

    /** Description */
    description?: string;

    /** Group */
    group?: number | null;

    /** VLAN */
    vlan?: number | null;

    /** Auth type */
    auth_type?: "open" | "wep" | "wpa-personal" | "wpa-enterprise";

    /** Auth cipher */
    auth_cipher?: "auto" | "tkip" | "aes";

    /** Pre-shared key */
    auth_psk?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WirelessLink {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;
    interface_a: NestedInterface;
    interface_b: NestedInterface;

    /** SSID */
    ssid?: string;

    /** Status */
    status?: {
      label: "Connected" | "Planned" | "Decommissioning";
      value: "connected" | "planned" | "decommissioning";
    };

    /** Description */
    description?: string;

    /** Auth type */
    auth_type?: {
      label: "Open" | "WEP" | "WPA Personal (PSK)" | "WPA Enterprise";
      value: "open" | "wep" | "wpa-personal" | "wpa-enterprise";
    };

    /** Auth cipher */
    auth_cipher?: {
      label: "Auto" | "TKIP" | "AES";
      value: "auto" | "tkip" | "aes";
    };

    /** Pre-shared key */
    auth_psk?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export interface WritableWirelessLink {
    /** ID */
    id?: number;

    /**
     * Url
     * @format uri
     */
    url?: string;

    /** Display */
    display?: string;

    /** Interface a */
    interface_a: number;

    /** Interface b */
    interface_b: number;

    /** SSID */
    ssid?: string;

    /** Status */
    status?: "connected" | "planned" | "decommissioning";

    /** Description */
    description?: string;

    /** Auth type */
    auth_type?: "open" | "wep" | "wpa-personal" | "wpa-enterprise";

    /** Auth cipher */
    auth_cipher?: "auto" | "tkip" | "aes";

    /** Pre-shared key */
    auth_psk?: string;
    tags?: NestedTag[];

    /** Custom fields */
    custom_fields?: object;

    /**
     * Created
     * @format date-time
     */
    created?: string;

    /**
     * Last updated
     * @format date-time
     */
    last_updated?: string;
  }

  export type QueryParamsType = Record<string | number, any>;
  export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

  export interface FullRequestParams extends Omit<RequestInit, "body"> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseFormat;
    /** request body */
    body?: unknown;
    /** base url */
    baseUrl?: string;
    /** request cancellation token */
    // cancelToken?: CancelToken;
  }
}

export { Netbox as Netbox };
