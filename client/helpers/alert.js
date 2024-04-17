import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import { View, Button } from "react-native";

export const successEvent = () => {
  return (
    <AlertNotificationRoot>
      <View>
        // dialog box
        <Button
          title={"dialog box"}
          onPress={() =>
            Dialog.show({
              type: ALERT_TYPE.SUCCESS,
              title: "Success",
              textBody: "Congrats! this is dialog box success",
              button: "close",
            })
          }
        />
      </View>
    </AlertNotificationRoot>
  );
};
