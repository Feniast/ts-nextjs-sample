import { useEffect } from "react";
import useFnRef from "./useFnRef";

const useUnmount = (fn: () => any) => {
  const fnRef = useFnRef(fn);
  useEffect(() => {
    return () => {
      return fnRef();
    };
  }, []);
};

export default useUnmount;
