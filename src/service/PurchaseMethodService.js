import axios from "axios";

export default class PurchaseMethodService {
	selectList() {
		return axios.get("/purchase/method")
			.then(res => res.data)
	}
	insertOne(purchaseMethod) {
		return axios.post("/purchase/method", purchaseMethod)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			});
	}
	updateOne(purchaseMethod) {
		return axios.put(`/purchase/method`, purchaseMethod)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			});
	}
	deleteOne(pcmSeq) {
		return axios.delete(`/purchase/method/${pcmSeq}`)
			.then((res) => {
				return res.data;
			})
			.catch((error) => {
				throw new Error(error.response.data.message);
			});
	}
}