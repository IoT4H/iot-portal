import type { Attribute, Schema } from "@strapi/strapi";

export interface FirmFirmRoles extends Schema.Component {
  collectionName: "components_firm_firm_roles";
  info: {
    displayName: "firm_roles";
  };
  attributes: {
    role: Attribute.Enumeration<["Admin", "Nutzer"]>;
    user: Attribute.Relation<"firm.firm-roles", "oneToOne", "plugin::users-permissions.user">;
  };
}

export interface FirmwareFlashConfig extends Schema.Component {
  collectionName: "components_firmware_flash_configs";
  info: {
    description: "";
    displayName: "FlashConfig";
    icon: "chartBubble";
  };
  attributes: {
    deviceConnectName: Attribute.String;
    littelfsSize: Attribute.String & Attribute.Required & Attribute.DefaultTo<"0x5000">;
    littlefsOffset: Attribute.String & Attribute.Required & Attribute.DefaultTo<"0x310000">;
    monitorSpeed: Attribute.Integer &
      Attribute.SetMinMax<
        {
          max: 5000000;
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<115200>;
    preRequirementText: Attribute.Blocks;
    uploadSpeed: Attribute.Integer &
      Attribute.SetMinMax<
        {
          max: 5000000;
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<115200>;
  };
}

export interface FirmwareFlashConfigAttribute extends Schema.Component {
  collectionName: "components_firmware_flash_config_attributes";
  info: {
    displayName: "FlashConfigAttribute";
    icon: "chartBubble";
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    type: Attribute.Enumeration<["string", "number"]> & Attribute.Required;
  };
}

export interface FirmwareFlashInstruction extends Schema.Component {
  collectionName: "components_firmware_flash_instructions";
  info: {
    description: "";
    displayName: "Flash Instruction";
    icon: "cog";
  };
  attributes: {
    binary: Attribute.Media<"files"> & Attribute.Required;
    flashAddress: Attribute.String & Attribute.Required & Attribute.DefaultTo<"0x1000">;
    type: Attribute.Enumeration<["bootloader", "firmware", "partiontable", "bundle", "others"]>;
  };
}

export interface FirmwareTest extends Schema.Component {
  collectionName: "components_test_tests";
  info: {
    description: "";
    displayName: "Image";
  };
  attributes: {
    amount: Attribute.Integer & Attribute.DefaultTo<1>;
    device: Attribute.Relation<"firmware.test", "oneToOne", "api::device.device">;
    firmware: Attribute.Media<"files">;
  };
}

export interface GeneralAddress extends Schema.Component {
  collectionName: "components_general_addresses";
  info: {
    description: "";
    displayName: "Address";
    icon: "pinMap";
  };
  attributes: {
    Address: Attribute.String;
    Address_2: Attribute.String;
    City: Attribute.String;
    Country: Attribute.String & Attribute.DefaultTo<"Germany">;
    Postal_code: Attribute.String;
    State: Attribute.String;
  };
}

export interface InstructionsAlternativeLabel extends Schema.Component {
  collectionName: "components_instructions_alternative_labels";
  info: {
    displayName: "Alternative Label";
    icon: "feather";
  };
  attributes: {
    form_alternative_label: Attribute.String & Attribute.Required;
    form_alternative_label_pattern: Attribute.String;
  };
}

export interface InstructionsAttributes extends Schema.Component {
  collectionName: "components_instructions_attributes";
  info: {
    description: "";
    displayName: "attributes";
    icon: "cog";
  };
  attributes: {
    attributeName: Attribute.String & Attribute.Required;
    defaultValue: Attribute.String & Attribute.Required;
    description: Attribute.String;
    enforced: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<false>;
    label: Attribute.String & Attribute.Required;
    maxValue: Attribute.Float;
    minValue: Attribute.Float;
    type: Attribute.Enumeration<["text", "number"]> & Attribute.Required & Attribute.DefaultTo<"text">;
  };
}

export interface InstructionsBaseInstruction extends Schema.Component {
  collectionName: "components_instructions_base_instructions";
  info: {
    displayName: "baseInstruction";
    icon: "file";
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    text: Attribute.Blocks & Attribute.Required;
  };
}

export interface InstructionsInstructions extends Schema.Component {
  collectionName: "components_instructions_instructions";
  info: {
    description: "";
    displayName: "instructions";
  };
  attributes: {
    pictures: Attribute.Media<"images" | "files" | "videos" | "audios", true>;
    step: Attribute.RichText & Attribute.Required;
    stepName: Attribute.String;
  };
}

export interface InstructionsListInstruction extends Schema.Component {
  collectionName: "components_instructions_list_instructions";
  info: {
    description: "";
    displayName: "ListInstruction";
    icon: "bulletList";
  };
  attributes: {
    meta: Attribute.Component<"instructions.base-instruction"> & Attribute.Required;
    tasks: Attribute.Component<"instructions.task", true>;
  };
}

export interface InstructionsRelationToSetup extends Schema.Component {
  collectionName: "components_thingsboard_relation_to_setups";
  info: {
    description: "";
    displayName: "relationToSetup";
  };
  attributes: {
    component: Attribute.JSON &
      Attribute.CustomField<
        "plugin::thingsboard-plugin.singleThingsboardComponent",
        {
          type: "AssetProfile";
          types: {
            AssetProfile: true;
            dashboard: false;
            DeviceProfile: true;
          };
        }
      >;
    direction: Attribute.Enumeration<["to", "from"]> & Attribute.Required;
    displayName: Attribute.String;
    name: Attribute.String;
  };
}

export interface InstructionsSetupInstruction extends Schema.Component {
  collectionName: "components_instructions_setup_instructions";
  info: {
    description: "";
    displayName: "setupInstruction";
    icon: "bulletList";
  };
  attributes: {
    alternativeLabel: Attribute.Component<"instructions.alternative-label">;
    flashConfig: Attribute.Component<"firmware.flash-config">;
    flashInstruction: Attribute.Component<"firmware.flash-instruction", true>;
    meta: Attribute.Component<"instructions.base-instruction"> & Attribute.Required;
    relations: Attribute.Component<"instructions.relation-to-setup", true>;
    serverAttributes: Attribute.Component<"instructions.attributes", true>;
    thingsboard_profile: Attribute.JSON &
      Attribute.Required &
      Attribute.CustomField<
        "plugin::thingsboard-plugin.singleThingsboardComponent",
        {
          types: {
            AssetProfile: true;
            dashboard: false;
            DeviceProfile: true;
            RuleChain: false;
          };
        }
      >;
  };
}

export interface InstructionsTask extends Schema.Component {
  collectionName: "components_instructions_tasks";
  info: {
    description: "";
    displayName: "Task";
    icon: "bulletList";
  };
  attributes: {
    text: Attribute.String & Attribute.Required;
  };
}

export interface InstructionsTextInstruction extends Schema.Component {
  collectionName: "components_instructions_text_instructions";
  info: {
    description: "";
    displayName: "textInstruction";
    icon: "arrowRight";
  };
  attributes: {
    meta: Attribute.Component<"instructions.base-instruction"> & Attribute.Required;
  };
}

export interface ThingsboardAssetProfile extends Schema.Component {
  collectionName: "components_thingsboard_asset_profiles";
  info: {
    displayName: "Asset Profile";
    icon: "chartBubble";
  };
  attributes: {
    Reference: Attribute.JSON &
      Attribute.CustomField<
        "plugin::thingsboard-plugin.thingsboardComponent",
        {
          type: "AssetProfile";
        }
      >;
  };
}

export interface ThingsboardComponent extends Schema.Component {
  collectionName: "components_general_components";
  info: {
    description: "";
    displayName: "Device Profile";
    icon: "server";
  };
  attributes: {
    Reference: Attribute.JSON &
      Attribute.CustomField<
        "plugin::thingsboard-plugin.thingsboardComponent",
        {
          type: "DeviceProfile";
        }
      >;
  };
}

export interface ThingsboardComponentDescription extends Schema.Component {
  collectionName: "components_thingsboard_component_descriptions";
  info: {
    displayName: "Component Description";
    icon: "information";
  };
  attributes: {
    Component: Attribute.JSON & Attribute.CustomField<"plugin::thingsboard-plugin.thingsboardComponent">;
    device: Attribute.Relation<"thingsboard.component-description", "oneToOne", "api::device.device">;
  };
}

export interface ThingsboardDashboard extends Schema.Component {
  collectionName: "components_thingsboard_dashboards";
  info: {
    description: "";
    displayName: "Dashboard";
    icon: "dashboard";
  };
  attributes: {
    Reference: Attribute.JSON &
      Attribute.CustomField<
        "plugin::thingsboard-plugin.thingsboardComponent",
        {
          type: "Dashboard";
        }
      >;
  };
}

export interface ThingsboardRuleChain extends Schema.Component {
  collectionName: "components_thingsboard_rule_chains";
  info: {
    displayName: "Rule Chain";
    icon: "link";
  };
  attributes: {
    Reference: Attribute.JSON &
      Attribute.CustomField<
        "plugin::thingsboard-plugin.thingsboardComponent",
        {
          type: "RuleChain";
        }
      >;
  };
}

declare module "@strapi/types" {
  export module Shared {
    export interface Components {
      "firm.firm-roles": FirmFirmRoles;
      "firmware.flash-config": FirmwareFlashConfig;
      "firmware.flash-config-attribute": FirmwareFlashConfigAttribute;
      "firmware.flash-instruction": FirmwareFlashInstruction;
      "firmware.test": FirmwareTest;
      "general.address": GeneralAddress;
      "instructions.alternative-label": InstructionsAlternativeLabel;
      "instructions.attributes": InstructionsAttributes;
      "instructions.base-instruction": InstructionsBaseInstruction;
      "instructions.instructions": InstructionsInstructions;
      "instructions.list-instruction": InstructionsListInstruction;
      "instructions.relation-to-setup": InstructionsRelationToSetup;
      "instructions.setup-instruction": InstructionsSetupInstruction;
      "instructions.task": InstructionsTask;
      "instructions.text-instruction": InstructionsTextInstruction;
      "thingsboard.asset-profile": ThingsboardAssetProfile;
      "thingsboard.component": ThingsboardComponent;
      "thingsboard.component-description": ThingsboardComponentDescription;
      "thingsboard.dashboard": ThingsboardDashboard;
      "thingsboard.rule-chain": ThingsboardRuleChain;
    }
  }
}
