import React, { useState, useEffect } from 'react'
import { Loader, Card, FormField } from '../components'

// RenderCards

// Définition des types nécessaires
type Post = {
  _id: string;
 
  name: string;
  prompt: string;
  photo: string;
};

type RenderCardsProps = {
  data: Post[];
  title: string;
  
};

// Définition du composant RenderCards
const RenderCards = ({ data, title }: RenderCardsProps): JSX.Element => {
  // Si le tableau data est défini et qu'il contient au moins un élément
  if (data?.length > 0) {
    // Rendre chaque élément de data sous forme d'un composant Card
    { data.map((post: Post) => <Card key={post._id} {...post} />)}

  
  }

  // Sinon, afficher le titre passé en prop
  return (
    <h2 className='mt-5 font-bold text-[#6449ff] text-x1 uppercase'>
      {title}
    </h2>
  );
};

const handleSearchChange = () => {
 
}

const Home = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [allPosts, setAllPosts] = useState<any>(null);

  const [searchText, setsearchText] = useState<string>('');

  useEffect(() =>{
    const fetchPosts = async ()=>{
      setLoading(true);

      try{
        
        const response = await fetch('http://localhost:8080/api/v1/post', {
        method: 'GET',
        headers:{
          'Content-Type': 'application/json',
        },
      })
      
      if(response.ok){
        
        const result = await response.json();
        
        setAllPosts(result.data.reverse());
        
      }
      }catch(error){
        alert(error)
      }
      finally{
        setLoading(false)
        
      }

    }
    fetchPosts();
  }, []);


  return (
        <section className='max-w-7xl mx-auto'>
        <div>
          <h1 className='font-extrabold text-[#222328] text-[32px]'>
            The Community Showcase
          </h1>
          <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Explore a captivating gallery of surreal and thought-provoking artwork brought to life by the creative power of Permouda AI.</p>
        </div>

      <div className='mt-16'>
      <FormField
          labelName='Search'
          type='text'
          name='search'
          placeholder='Search posts'
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>


      <div className='mt-10'>
      {loading ? (
        <div className='flex justify-center items-center'>
        <Loader />
        </div>
        
      ) : (
        <>
        
        
        <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>

          {searchText ? (
            <RenderCards 
            data={[]}
            title="No search result found"
            />
          ): (
            <RenderCards
            data={allPosts}
            title="No posts found"
            />
          )}
        </div> 

        </>
      )}
      </div>
    </section>
  )
}

export default Home