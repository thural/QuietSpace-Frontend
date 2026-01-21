import { createUseStyles } from "react-jss";
import { Theme } from "../../../../shared/types/theme";

const useStyles = createUseStyles((theme: Theme) => ({
  panel: {
    width: "100%",
    margin: `0 ${theme.spacing(theme.spacingFactor.xl)}`
  },
  tabs: { margin: '0' }
}));

export default useStyles