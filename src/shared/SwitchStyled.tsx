import { Switch } from "@/shared/ui/components";

const SwitchStyled = ({
  label = "switch label",
  size = "md" as "md" | "sm" | "lg",
  checked = false,
  onChange = (checked: boolean) =>
    console.log("missing change event for switch: ", checked)
}) => {
  return (
    <Switch
      label={label}
      size={size}
      checked={checked}
      onChange={onChange}
    />
  );
}

export default SwitchStyled