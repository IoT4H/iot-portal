import { Button, Field, FieldAction, FieldInput, FieldLabel, Flex } from "@strapi/design-system";

import { Cross, Plus } from '@strapi/icons'
import * as React from "react";
import { useState } from "react";

import { useIntl } from "react-intl";

const Input = React.forwardRef((props: any, ref) => {
  const {attribute, disabled, intlLabel, name, onChange, required, value} =
    props; // these are just some of the props passed by the content-manager

  const {formatMessage} = useIntl();

  const [list, SetList] = useState(Array.from<string>(value != "null" && value != null ? Array.from<string>(JSON.parse(value)).filter(item => typeof item === 'string' && item.trim() !== '') : []));

  const handleChange = () => {
    onChange({
      target: {
        name,
        type: attribute.type,
        value: JSON.stringify(list.filter(item => typeof item === 'string' && item.trim() !== '')),
      },
    });
  };

  return (
    <div className={"w-full"}>
      <Field hint="Your full legal name with any middle names">
        <FieldLabel>{formatMessage(intlLabel)}</FieldLabel>
        <Flex direction="column" justifyContent="flex-start" alignItems="stretch" gap={2} wrap={"wrap"}>
          {
            list.map((item, index, array) => {
              return (<FieldInput type={"text"} placeholder={"Neues Schlüsselwort"} onChange={(event: any) => {
                  let l = list;
                  l[index] = (event.currentTarget.value || "").trim();
                  SetList(l);
                  handleChange();
                }} value={item} endAction={(
                  <FieldAction label="Schlüsselwort entfernen">
                    <Cross
                      onClick={() => {
                        let l = list;
                        l.splice(index, 1)
                        SetList(l);
                        handleChange();
                      }}
                      label="Schlüsselwort entfernen"
                    />
                  </FieldAction>)}/>

              );
            })
          }
          <Button
            fullWidth
            variant="primary"     // this applies primary color
            startIcon={<Plus/>}
            onClick={() => {
              let l = list;
              l.push(" ");
              SetList(l);
              handleChange();
            }}
          >
            Hinzufügen
          </Button>
        </Flex>
      </Field>
    </div>
  );
});

export default Input;
