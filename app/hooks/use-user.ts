import type { PersonTypes } from "@/types/AuthTypes";
import Cookies from "js-cookie";

const useUser = () => {
	return Cookies.get("info")
		? (JSON.parse(Cookies.get("info") || "") as PersonTypes)
		: ({} as PersonTypes);
};

export default useUser;
