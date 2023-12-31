import { ChangeEvent } from "react";

type RadioGroupProps = {
  RadioGroupOption: RadioGroupOption[];
  disabled: boolean;
  rules: number[];
  name: string;
  selected: number;
};

type RadioGroupOption = {
  id: number;
  value: string;
};

interface IRadioGroup {
  handleOnChange: (id: number, name: string, value: string) => void;
}
const RadioGroup = (props: RadioGroupProps & IRadioGroup) => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {props.RadioGroupOption.map((val) => {
        return (
          <div style={{ marginRight: "10px" }}>
            <input disabled={props.disabled || props.rules.includes(val.id)} onChange={(e: ChangeEvent<HTMLInputElement>) => props.handleOnChange(Number(e.target.value), e.target.name, val.value)} type="radio" value={val.id} checked={props.selected === val.id} name={props.name} />
            <label>{val.value}</label>
          </div>
        );
      })}
    </div>
  );
};

export default RadioGroup;
