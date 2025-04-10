/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

export function useSkipInitialQuery(queryVariables: Record<any, any>) {
  // 在SSR环境中，始终返回true以跳过查询
  if (typeof window === "undefined") {
    return true;
  }

  const [initQueryVarsAreSet, setInitQueryVarsAreSet] = useState(false);
  const [skipQuery, setSkipQuery] = useState(true);

  useEffect(() => {
    setInitQueryVarsAreSet(true);
  }, [JSON.stringify(queryVariables)]);

  useEffect(() => {
    if (initQueryVarsAreSet) setSkipQuery(false);
  }, [JSON.stringify(queryVariables)]);

  return skipQuery;
}
