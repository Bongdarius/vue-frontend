import axios from "axios";

export default class MemberService {
	login(member) {
		return axios.get("/member/login", {params: member})
			.then(res => res.data)
	}
	selectList() {
		return axios.get("/member")
			.then(res => res.data)
	}
	insertOne(member) {
		return axios.post("/member", member)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			});
	}
	updateOne(member) {
		return axios.put(`/member`, member)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			});
	}
	deleteOne(mbSeq) {
		return axios.delete(`/member/${mbSeq}`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			});
	}
	resetPw(mbId) {
		return axios.get("/member/resetPw", {params: mbId})
			.then(res => res.data)
			.catch(e => {
				throw new Error(e.response.data.message);
			})
	}
}