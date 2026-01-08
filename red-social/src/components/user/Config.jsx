import React, { useState } from "react";
import useAuth from '../../hooks/useAuth';
import { Global } from "../../helpers/Global";
import avatar from '../../assets/img/user.png';
import { SerializeForm } from "../../helpers/SerializeForm";

export const Config = () => {

  const [saved, setSaved] = useState(null);
  const {auth, setAuth} = useAuth();

  const updateUser = async(e) => {
    e.preventDefault();
    
    // Token de auth
    const token = localStorage.getItem('token');

    const newDataUser = SerializeForm(e.target);
    delete newDataUser.file0;

    const req = await fetch(Global.url + 'user/update', {
      method: 'PUT',
      body: JSON.stringify(newDataUser),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    });

    const data = await req.json();
    setSaved({status: data.status, message: data.message});

    if(data.status === 'success') {
      delete data.userUpdated.password;
      setAuth(data.userUpdated);
    }

    // Subida de imagenes
    const fileInput = document.querySelector('#file');

    if(data.status === 'success' && fileInput.files[0]) {

      // Recoger fichero a subir
      const formData = new FormData();
      formData.append('file0', fileInput.files[0]);

      // Peticion para enviar la imagen o fichero
      const uploadReq = await fetch(Global.url + 'user/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': token
        }
      });
      const uploadData = await uploadReq.json();

      if(uploadData.status === 'success') {
        setAuth(uploadData.user);
      } else {
        setSaved({status: dataUpload.status, message: dataUpload.message});
      }
    } 
    console.log(saved);
  };
  
  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Ajustes</h1>
      </header>

      <div className="content__posts">
        {
          saved && (
            <strong className={"alert alert-" + (saved.status === 'success' ? 'success' : 'danger')}>
              {saved.message}
            </strong>
          )
        }

        <form className="config-form" onSubmit={updateUser}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" name="name" defaultValue={auth.name}/>
          </div>

          <div className="form-group">
            <label htmlFor="surname">Apellido</label>
            <input type="text" name="surname" defaultValue={auth.surname}/>
          </div>

          <div className="form-group">
            <label htmlFor="nick">Nick</label>
            <input type="text" name="nick" defaultValue={auth.nick}/>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Biografía</label>
            <textarea name="bio" defaultValue={auth.bio}/>
          </div>

          <div className="form-group">
            <label htmlFor="file0">Avatar</label>
            <div className="general-info__container-avatar">
              <img 
                src={auth.image !== 'default.png' ? Global.url + 'user/avatar/' + auth.image : avatar} 
                className="container-avatar__img" 
                alt="Foto de perfil" 
              />
            </div>
            <br/>
            <input type="file" name="file0" id="file"/>
          </div>
          <br/>
          <input type="submit" value="Actualizar" className="btn btn-success" />
        </form>
        <br/>
      </div>
    </>
  );
};
