import * as React from "react";

import { useIntl } from "react-intl";
import { TextInput } from "@strapi/design-system"


const TBIDInput = React.forwardRef((props, ref) => {
  // @ts-ignore
  const { attribute,  name, onChange, value } =
    props; // these are just some of the props passed by the content-manager

  const { formatMessage } = useIntl();

  // @ts-ignore
  const handleChange = (e) => {
    onChange({
      target: { name, type: attribute.type, value: e.currentTarget.value },
    });
  };

  return (
      <TextInput placeholder="This is a Thingsboard ID placeholder" label={"Thingsboard ID"} name={name} hint="ID in Thingsboard" value={value} required disabled />
  );
});

export default TBIDInput;