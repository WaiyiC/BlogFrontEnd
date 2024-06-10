import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://a9cae81d-c094-4635-9860-14e886ff26fe-00-1n32cs1xece6w.pike.replit.dev:3000/', // Ensure this matches your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
//https://feec368b-f2cd-4c78-ba6d-d66f03597562-00-2xj5l7c94qwox.sisko.repl.co:3000/
//5180bb11-29ac-4f58-97b1-2b025e251db8-00-3415vnygwmulx.sisko.replit.dev/

//90b48509-8be0-43fd-aa07-b3855da4015a-00-2dafu0mps44fp.pike.replit.dev/