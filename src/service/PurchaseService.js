import axios from "axios";

export default class PurchaseService {
	debugger;
	selectList(month) {
		return axios.get("/purchase", {params: {
			month: month
		}})
			.then(res => res.data)
	}
	selectMonthList(mbSeq) {
		return axios.get("/purchase/month", {params: {
			mbSeq: mbSeq
			}})
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