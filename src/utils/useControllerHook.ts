import { useEffect, useState } from "react";

import UIController from "../controllers/UIController";

const useControllerHook = <T extends UIController>(controller: T) => {
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const subscription = controller.registerObservable(() => {
      setRenderKey(v => v + 1);
    });

    return () => {
      for (const key in subscription) {
        subscription[key].remove();
      }
    }
  }, []);

  return { renderKey };
}

export default useControllerHook;
