<template>
  <div class="login-container">
    <h2 class="title">로그인</h2>
      <input type="id" v-model="member.mbId" placeholder="아이디" @keydown.enter="login"/>
      <input type="password" v-model="member.mbPassword" placeholder="비밀번호" @keydown.enter="login"/>
      <div class="flex justify-end gap-2 w-full">
        <Button label="로그인" @click="login" class="flex-grow" />
        <Button label="회원가입" @click="visible = true" class="flex-grow" />
      </div>
      <div>
          <a href="#" @click="resetPwVisible = true">비밀번호 초기화</a>
      </div>
  </div>
  <div>
  </div>
  <Dialog v-model:visible="visible" modal header="회원가입" :style="{ width: '20rem' }">
      <span class="text-surface-500 dark:text-surface-400 block mb-4">사용자 정보를 입력하시오.</span>
      <div class="flex items-center gap-4">
          <label for="mbId" :style="{ width: '50%' }" class="font-semibold w-100">아이디</label>
          <InputText id="mbId" v-model.trim="regMember.mbId" autocomplete="off" />
      </div>
      <label id="labelMbId" v-if="regVisible.mbId" class="mb-4" :style="{color: 'red'}">아이디를 입력해주세요.</label>
      <div class="flex items-center gap-4">
          <label for="mbPassword" :style="{ width: '50%' }"  class="font-semibold w-100">비밀번호</label>
          <InputText type="password" id="mbPassword" v-model.trim="regMember.mbPassword" autocomplete="off" />
      </div>
      <label id="labelMbPassword" v-if="regVisible.mbPassword" class="mb-4" :style="{color: 'red'}">비밀번호를 입력해주세요.</label>
      <div class="flex items-center gap-4">
          <label for="mbNick" :style="{ width: '50%' }"  class="font-semibold w-100">닉네임</label>
          <InputText id="mbNick" v-model.trim="regMember.mbNick" autocomplete="off" />
      </div>
      <label id="labelMbNick" v-if="regVisible.mbNick" class="mb-4" :style="{color: 'red'}">닉네임을 입력해주세요.</label>
      <div class="flex justify-end gap-2">
          <Button type="button" label="취소" severity="secondary" @click="visible = false"></Button>
          <Button type="button" label="저장" @click="signUp"></Button>
      </div>
  </Dialog>

  <Dialog v-model:visible="resetPwVisible" modal header="비밀번호 초기화" :style="{ width: '20rem' }">
    <div class="flex items-center gap-4">
        <label for="resetMbId" :style="{ width: '50%' }" class="font-semibold w-100">아이디</label>
        <InputText id="resetMbId" v-model.trim="resetMbId" autocomplete="off" @keydown.enter="resetPw"/>
    </div>
    <label id="labelMbId" v-if="resetVisible" class="mb-4" :style="{color: 'red'}">일치하는 아이디가 없습니다.</label>
    <div class="flex justify-end gap-2">
        <Button type="button" label="취소" severity="secondary" @click="resetPwVisible = false; resetVisible = false;"></Button>
        <Button type="button" label="저장" @click="resetPw"></Button>
    </div>
  </Dialog>
</template>

<script>
import { reactive, ref } from 'vue';
import MemberService from '@/service/MemberService';
import store from '@/store/state'; // store 파일 import
import { useRouter } from 'vue-router';

export default {
    setup() {
        const regVisible = ref({mbId: false, mbPassword: false, mbNick: false});
        const resetVisible = ref(false);
        const regMember = ref({});
        const resetMbId = ref();
        const visible = ref(false);
        const resetPwVisible = ref(false);
        const router = useRouter();
        const member = reactive({mbId: null, mbPassword: null});     
        const memberService = new MemberService();   
        const resetPw = () => {
          resetVisible.value = false;

          memberService.resetPw({mbId: resetMbId.value})
            .then(data => {
              if(data) {
                resetPwVisible.value = false;
                alert("비밀번호가 초기화되었습니다. 초기화된 비밀번호는 '1234'입니다.");
              }  
            })
            .catch((e) => {
              console.log(e.message);
              resetVisible.value = true;
            })
        }

        const login = () => {
          memberService.login(member)
              .then((data) => {
                  if(!data) return;
                  store.commit('changeIsLogin', true);
                  store.commit('changeUserSeq', data.mbSeq);
                  store.commit('changeUserId', data.mbId);
                  store.commit('changeUserNick', data.mbNick);
                  router.push('/');
              }).catch((error) => {
                  store.commit('changeIsLogin', false);
                  alert(`아이디 혹은 비밀번호를 확인해주세요. : ${error.message}`);
              })
        }

        const signUp = () => {
          const mbId = regMember.value.mbId;
          const mbPassword = regMember.value.mbPassword;
          const mbNick = regMember.value.mbNick;

          regVisible.value.mbId = false; 
          regVisible.value.mbPassword = false;
          regVisible.value.mbNick = false;

          if(mbId == null) {
            regVisible.value.mbId = true; 
            document.getElementById("mbId").focus();
            return;
          }
          if(mbPassword == null) {
            regVisible.value.mbPassword = true;
            document.getElementById("mbPassword").focus();
            return;
          }
          if(mbNick == null) {
            regVisible.value.mbNick = true;
            document.getElementById("mbNick").focus();
            return;
          }

          memberService.insertOne(regMember.value)
            .then((data) => {
              if(data.mbId != null) {
                alert("회원가입이 완료되었습니다.");
                visible.value = false;
              }
            })
            .catch((error) => {
              console.log(error);
              alert(`${error.message}`);
            })
        }

        return {
            member, regMember, regVisible, resetVisible, resetMbId,
            login, signUp, resetPwVisible, resetPw,
            router,
            visible,
        }
    }
};
</script>

<style>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 10px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}

button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50; 
  color: white;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #3e8e41; 
  transition: background-color 0.3s ease-in-out;
}
</style>
