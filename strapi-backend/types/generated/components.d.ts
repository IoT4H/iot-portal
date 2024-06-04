import type { Schema, Attribute } from '@strapi/strapi';

export interface FirmFirmRoles extends Schema.Component {
  collectionName: 'components_firm_firm_roles';
  info: {
    displayName: 'firm_roles';
  };
  attributes: {
    user: Attribute.Relation<
      'firm.firm-roles',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    role: Attribute.Enumeration<['Admin', 'Nutzer']>;
  };
}

export interface FirmwareFlashConfigAttribute extends Schema.Component {
  collectionName: 'components_firmware_flash_config_attributes';
  info: {
    displayName: 'FlashConfigAttribute';
    icon: 'chartBubble';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    label: Attribute.String & Attribute.Required;
    type: Attribute.Enumeration<['string', 'number']> & Attribute.Required;
  };
}

export interface FirmwareFlashConfig extends Schema.Component {
  collectionName: 'components_firmware_flash_configs';
  info: {
    displayName: 'FlashConfig';
    icon: 'chartBubble';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    attributes: Attribute.Component<'firmware.flash-config-attribute', true> &
      Attribute.Required;
  };
}

export interface FirmwareTest extends Schema.Component {
  collectionName: 'components_test_tests';
  info: {
    displayName: 'Image';
    description: '';
  };
  attributes: {
    firmware: Attribute.Media;
    amount: Attribute.Integer & Attribute.DefaultTo<1>;
    device: Attribute.Relation<
      'firmware.test',
      'oneToOne',
      'api::device.device'
    >;
  };
}

export interface GeneralAddress extends Schema.Component {
  collectionName: 'components_general_addresses';
  info: {
    displayName: 'Address';
    icon: 'pinMap';
  };
  attributes: {
    Address: Attribute.String & Attribute.Required;
    Address_2: Attribute.String;
    City: Attribute.String;
    Postal_code: Attribute.String;
    State: Attribute.String;
    Country: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'Germany'>;
  };
}

export interface InstructionsBaseInstruction extends Schema.Component {
  collectionName: 'components_instructions_base_instructions';
  info: {
    displayName: 'baseInstruction';
    icon: 'file';
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    text: Attribute.Blocks & Attribute.Required;
  };
}

export interface InstructionsInstructions extends Schema.Component {
  collectionName: 'components_instructions_instructions';
  info: {
    displayName: 'instructions';
    description: '';
  };
  attributes: {
    stepName: Attribute.String;
    pictures: Attribute.Media;
    step: Attribute.RichText & Attribute.Required;
  };
}

export interface InstructionsListInstruction extends Schema.Component {
  collectionName: 'components_instructions_list_instructions';
  info: {
    displayName: 'ListInstruction';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    meta: Attribute.Component<'instructions.base-instruction'> &
      Attribute.Required;
    tasks: Attribute.Component<'instructions.task', true>;
  };
}

export interface InstructionsSetupInstruction extends Schema.Component {
  collectionName: 'components_instructions_setup_instructions';
  info: {
    displayName: 'setupInstruction';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    meta: Attribute.Component<'instructions.base-instruction'> &
      Attribute.Required;
    thingsboard_profile: Attribute.JSON &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::thingsboard-plugin.singleThingsboardComponent',
        {
          types: {
            dashboard: false;
            DeviceProfile: true;
            RuleChain: false;
            AssetProfile: true;
          };
        }
      >;
    form_alternative_label: Attribute.String &
      Attribute.Required &
      Attribute.DefaultTo<'Name'>;
    flashProcess: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    form_alternative_label_required: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
  };
}

export interface InstructionsTask extends Schema.Component {
  collectionName: 'components_instructions_tasks';
  info: {
    displayName: 'Task';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    text: Attribute.String & Attribute.Required;
  };
}

export interface InstructionsTextInstruction extends Schema.Component {
  collectionName: 'components_instructions_text_instructions';
  info: {
    displayName: 'textInstruction';
    icon: 'arrowRight';
    description: '';
  };
  attributes: {
    meta: Attribute.Component<'instructions.base-instruction'> &
      Attribute.Required;
  };
}

export interface ThingsboardAssetProfile extends Schema.Component {
  collectionName: 'components_thingsboard_asset_profiles';
  info: {
    displayName: 'Asset Profile';
    icon: 'chartBubble';
  };
  attributes: {
    Reference: Attribute.JSON &
      Attribute.CustomField<
        'plugin::thingsboard-plugin.thingsboardComponent',
        {
          type: 'AssetProfile';
        }
      >;
  };
}

export interface ThingsboardComponentDescription extends Schema.Component {
  collectionName: 'components_thingsboard_component_descriptions';
  info: {
    displayName: 'Component Description';
    icon: 'information';
  };
  attributes: {
    Component: Attribute.JSON &
      Attribute.CustomField<'plugin::thingsboard-plugin.thingsboardComponent'>;
    device: Attribute.Relation<
      'thingsboard.component-description',
      'oneToOne',
      'api::device.device'
    >;
  };
}

export interface ThingsboardComponent extends Schema.Component {
  collectionName: 'components_general_components';
  info: {
    displayName: 'Device Profile';
    description: '';
    icon: 'server';
  };
  attributes: {
    Reference: Attribute.JSON &
      Attribute.CustomField<
        'plugin::thingsboard-plugin.thingsboardComponent',
        {
          type: 'DeviceProfile';
        }
      >;
  };
}

export interface ThingsboardDashboard extends Schema.Component {
  collectionName: 'components_thingsboard_dashboards';
  info: {
    displayName: 'Dashboard';
    icon: 'dashboard';
    description: '';
  };
  attributes: {
    Reference: Attribute.JSON &
      Attribute.CustomField<
        'plugin::thingsboard-plugin.thingsboardComponent',
        {
          type: 'Dashboard';
        }
      >;
  };
}

export interface ThingsboardRuleChain extends Schema.Component {
  collectionName: 'components_thingsboard_rule_chains';
  info: {
    displayName: 'Rule Chain';
    icon: 'link';
  };
  attributes: {
    Reference: Attribute.JSON &
      Attribute.CustomField<
        'plugin::thingsboard-plugin.thingsboardComponent',
        {
          type: 'RuleChain';
        }
      >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'firm.firm-roles': FirmFirmRoles;
      'firmware.flash-config-attribute': FirmwareFlashConfigAttribute;
      'firmware.flash-config': FirmwareFlashConfig;
      'firmware.test': FirmwareTest;
      'general.address': GeneralAddress;
      'instructions.base-instruction': InstructionsBaseInstruction;
      'instructions.instructions': InstructionsInstructions;
      'instructions.list-instruction': InstructionsListInstruction;
      'instructions.setup-instruction': InstructionsSetupInstruction;
      'instructions.task': InstructionsTask;
      'instructions.text-instruction': InstructionsTextInstruction;
      'thingsboard.asset-profile': ThingsboardAssetProfile;
      'thingsboard.component-description': ThingsboardComponentDescription;
      'thingsboard.component': ThingsboardComponent;
      'thingsboard.dashboard': ThingsboardDashboard;
      'thingsboard.rule-chain': ThingsboardRuleChain;
    }
  }
}
