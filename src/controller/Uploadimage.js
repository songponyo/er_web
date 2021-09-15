import { storage } from "../component/firebase/index";

export default class Uploadimage {
  uploadFile = async (data) => {
    return new Promise((resolve, reject) => {
      const { upload_path, src } = data;
      if (src.file === undefined && src.file === null) {
        return { require: false, err: "file not found!" };
      } else { 
        
        const uploadTask = storage
          .ref(`${upload_path}/${src.file.name}`)
          .put(src.file);
        // console.log("uploadTask", uploadTask);
        
        uploadTask.on(
          "state_changed", 
          async () => {
            // complete function ....
            console.log("upload_path",upload_path);
            console.log("src.file.name",src.file.name);
            let url = await storage
              .ref(upload_path)
              .child(src.file.name) // Upload the file and metadata
              .getDownloadURL() // get download url
              .then((res) => res);
              
            return url ? resolve(url) : resolve("upload fail");
            // return url ? url : 'upload fail'
          },
          (error) => resolve(error)
        );
      }
    });
  };
}
