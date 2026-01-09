import { Global } from "./Global";


const GetProfile = async (profileId, setState = null) => {
  const req = await fetch(Global.url + 'user/profile/' + profileId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    }
  });

  const data = await req.json();

  if(data.status !== 'success') {
    return null;
  }

  if(setState) {
    setState(data.user);
  }

  return data;
}

export default GetProfile;