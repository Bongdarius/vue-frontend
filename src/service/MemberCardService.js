import axios from "axios";

export default class MemberCardService {
	selectList() {
		return axios.get("/memberCard/1")
			.then(res => res.data)
	}
	insertOne(memberCard) {
		return axios.post("/memberCard", memberCard)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			});
	}
	updateOne(memberCard) {
		return axios.put(`/memberCard`, memberCard)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			});
	}
	deleteOne(mcSeq) {
		return axios.delete(`/memberCard/${mcSeq}`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			});
	}
}