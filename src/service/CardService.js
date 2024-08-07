import axios from "axios";

export default class CardService {
	selectList() {
		return axios.get("/card")
			.then(res => res.data)
	}
	selectListByItems() {
		return axios.get("/card/byItems")
			.then(res => res.data)
	}
	insertOne(card) {
		return axios.post("/card", card)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			});
	}
	updateOne(card) {
		return axios.put(`/card`, card)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			});
	}
	deleteOne(cardSeq) {
		return axios.delete(`/card/${cardSeq}`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			});
	}
}