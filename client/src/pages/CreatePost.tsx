import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';

interface FormState {
  name: string;
  prompt: string;
  photo: string;
}

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    name: '',
    prompt: '',
    photo: '',
  });
  const [generatingImg, setGenerationImg] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // 24-mars Calling from backend

  // handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    if(form.prompt && form.photo){
      setLoading(true);
      try{
        
        const response = await fetch('http://localhost:8080/api/v1/post',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });
        

        await response.json();
        navigate('/');
      }catch (err){
        
        alert(err)
      }finally{
        
        setLoading(false);
      }
    } else {
      alert('Please enter a prompt and generate an image')
    }
  }

  
  const generateImage = async() => {
    // Generating image
    if(form.prompt){
      try {
        setGenerationImg(true);
        const response = await fetch('http://localhost:8080/api/v1/dalle',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: form.prompt}),
        })

        const data = await response.json();

        setForm({...form, photo: `data:image/jpeg;base64,${data.photo}`});
      }catch (error){
        alert(error);
      } finally{
        setGenerationImg(false);
      }
    } else {
      alert('Please enter a prompt');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value })
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt)
    setForm({...form, prompt: randomPrompt})
  };
  return (
    <div><section className='max-w-7xl mx-auto'>
    <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>
          Create
        </h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Create imaginative and visually stunning images generated through Permouda AI and share it</p>
      </div>
    <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
    <div className='flex flex-col gap-5'>
      <FormField 
      labelName="Your Name"
      type="text"
      name="name"
      placeholder="Pérmouda"
      value={form.name}
      handleChange={handleChange}
      />
      <FormField 
      labelName="Prompt"
      type="text"
      name="prompt"
      placeholder="A plush toy robot sitting against a yellow wall"
      value={form.prompt}
      handleChange={handleChange}
      isSurpriseMe
      handleSurpriseMe={handleSurpriseMe}
      />
<div className='relative bg-gray-50 border border-grai-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focu:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
          {form.photo ? (
            <img 
            src={form.photo}
            alt={form.prompt}
            className='w-full object-contain'
            />
          ):(
            <img 
            src={preview}
            alt={preview}
            className='w-9/12 h-9/12 object-contain opacity-40'
            /> 
          )}

        {generatingImg && (
          <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
            <Loader />
          </div>
        )}
        </div>
    </div>
    <div className='mt-5 flex gap-5'>
        <button
        type="button"
        onClick={generateImage}
        className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
          {generatingImg ? 'Generatin...' : 'generate'}
        </button>
      </div>
      <div className='mt-10'>
        <p className='mt-2 text-[#666e75] text-[14px]'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non rem ut distinctio recusandae sapiente magni adipisci aut error fuga ad odio, autem incidunt consectetur eaque explicabo, cupiditate repellat. Dolores, sapiente?</p>
      <button 
      type="submit"
      className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
      >
        {loading ? 'Sharing...' : 'Share with the community'}
      </button>
      </div>

    </form>
  </section></div>
  )
}

export default CreatePost