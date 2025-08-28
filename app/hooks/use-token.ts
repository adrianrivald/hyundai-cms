import Cookies from "js-cookie";

const useToken = () => {
	const token = Cookies.get("token") ?? null;

	return token;
};

export default useToken;
