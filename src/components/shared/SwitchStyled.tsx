import { Switch } from '@mantine/core';

const SwitchStyled = ({
  color = "rgba(0, 255, 255, 1)",
  labelPosition = "left",
  label = "switch label",
  name = "switchName",
  description = "switch description",
  size = "md",
  checked = undefined,
  onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    console.log("mising change event for switch: ", event.target.value)
}) => {
  return (
    <Switch
      color={color}
      name={name}
      labelPosition={labelPosition}
      label={label}
      description={description}
      size={size}
      checked={checked}
      onChange={onChange}
    />
  );
}

export default SwitchStyled