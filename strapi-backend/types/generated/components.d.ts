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

export interface InstructionsInstructions extends Schema.Component {
  collectionName: 'components_instructions_instructions';
  info: {
    displayName: 'instructions';
  };
  attributes: {
    stepName: Attribute.String;
    pictures: Attribute.Media;
    step: Attribute.RichText & Attribute.Required;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'firm.firm-roles': FirmFirmRoles;
      'firmware.test': FirmwareTest;
      'instructions.instructions': InstructionsInstructions;
    }
  }
}
