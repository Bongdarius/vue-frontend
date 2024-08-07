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
	insertList(memberCard) {
		return axios.post("/memberCard/list", memberCard)
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
	updateList(memberCard) {
		return axios.put(`/memberCard/list`, memberCard)
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
	deleteList(memberCard) {
		return axios.put("/memberCard/deletelist", memberCard)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			});
	}
}