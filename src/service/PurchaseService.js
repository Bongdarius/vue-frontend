import axios from "axios";

export default class PurchaseService {
	selectList() {
		return axios.get("/purchase")
			.then(res => res.data)
	}
	saveList(purchase) {
		return axios.post(`/purchase/list`, purchase)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			});
	}
	deleteList(purchase) {
		return axios.post("/purchase/deleteList", purchase)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			});
	}
}