import { useState,useEffect } from 'react';
import Form from '../Form/Form';
import s from './App.module.css';
import Api from '../../Service/ServiceApi';
import Gallery from '../Gallery/Gallery';
import Modal from '../Modal/Modal';
import Spinner from '../Spinner/Spinner';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {

  const [searh, setSearh] = useState('');
  const [page, setPage] = useState(1);
  const [isModal, setIsModal] = useState(false);
  const [modal, setModal] = useState('');
  const [images, setImages] = useState([]);
  const [isSpin, setIsSpin] = useState(false);
  
  useEffect((props) => {
    async function axiosInquiry() {
      try{
          
        if(!searh){return}
                
        setIsSpin(true)
                
        const image = await Api(searh, page);
                
        setImages((prevImages) => ([...prevImages, ...(image)]));
        
              if (image.length > 0) {
                  
                setIsSpin(false)
                   
                }
                else {
                    (toast.error("Введите другую строку поиска"))
              }
        
                if(page > 1) { window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth',
                })
                }
            
        } catch (error) {
            (toast.error("Woops, something went wrong... Try again later."))
        } 
    }
    axiosInquiry();
  }, [searh,page])

  const handleFormSubmit = (searhs) => {
    if (searhs !== searh) {
      setImages([]);
      setSearh(searhs);
      setPage(1);
    }
    else {
      (toast.error("Строка совпадает с ранее введенной"));
    }
    
  }
  
  const handleClick = () => {
    setPage((prevPage) => prevPage + 1)
  }
  const onClickGal = img => {
    setIsModal(true);
    setModal(img.largeImageURL);
  }
  const onClose = () => {
    setIsModal(!isModal);

  };
  
    const isBtn = images.length > 0 && !isSpin;
    return (
      <>
        <Form searh={handleFormSubmit} />
        
        {images.length > 0 && (<Gallery images={images} onClickGal={onClickGal} />)}
        
        {isBtn &&
          <button
            type='button'
            className={s.button}
            onClick={handleClick}
          >Load more
          </button>}
        
        {isSpin && <Spinner />}

        {isModal && (<Modal onClose={onClose} >
                    {<img src={modal} alt="" />}
          </Modal>)}

        <ToastContainer />
      </>
    )
    
  }
