import axios from "axios";

export default class TestService {

	selectCardList() {
		return axios.get("/card").then(res => res.data)
	}

	selectList() {
		return axios.get("/test")
			.then(res => {
				return res.data
			}).catch(e => {
				throw new Error(e.response.data.massage);
			})
	}
}