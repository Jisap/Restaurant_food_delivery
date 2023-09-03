"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState } from "react";





const AddPage = () => {

  const { data: session, status } = useSession();

  const [inputs, setInputs] = useState({
    title: "",
    desc: "",
    price: 0,
    catSlug: 0,
  });

  const[options, setOptions] = useState({
    title:"",
    additionalPrice: 0,
  })

  const router = useRouter();

  if(status === 'loading'){
    return <p>Loading....</p>
  }

  if( status === "unauthenticated" || !session?.user.isAdmin ){
    router.push("/");
  }


  return (
      <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex items-center justify-center text-red-500">
          <form className="flex flex-wrap gap-6">
              <h1 className="text-4xl mb-2 text-gray-300 font-bold">Add New Product</h1>
              
              <div className="w-full flex flex-col gap-2 ">
                <label className="text-sm">Title</label>
                <input 
                    type="text" 
                    name="title"
                    placeholder="Bella Napoli"
                    className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none" 
                />
              </div>

              <div className="text-sm cursor-pointer flex gap-4 items-center">
                <label className="text-sm">Desc</label>
                <textarea 
                    rows={3}
                    name="desc" 
                    placeholder="A timeless favorite with a twist, showcasing a thin crust topped with sweet tomatoes, fresh basil and creamy mozzarella."
                    className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
                />
              </div>

              <div className="text-sm cursor-pointer flex gap-4 items-center">
                <label className="text-sm">Price</label>
                <input 
                    type="number" 
                    name="price"
                    placeholder="29"
                    className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none" 
                />
              </div>

              <div className="text-sm cursor-pointer flex gap-4 items-center">
                <label className="text-sm">Category</label>
                <input 
                    type="text" 
                    name="category"
                    placeholder="pizzas"
                    className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
                />
              </div>

              <div className="w-full flex flex-col gap-2">
                <label className="text-sm">Options</label>
                <div className="flex">
                    <input 
                        type="text" 
                        placeholder="Title" 
                        name="title" 
                        className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
                    />
                    <input 
                        type="number" 
                        placeholder="additionalPrice" 
                        name="additionalPrice" 
                        className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"    
                    />
                    <button className="bg-gray-500 p-2 text-white">
                        Add Option
                    </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-2">
                <div className="p-2  rounded-md cursor-pointer bg-gray-200 text-gray-400">
                    <span>Small</span>
                    <span className="text-xs">$2</span>
                </div>
              </div>

              <button
                  type="submit"
                  className="bg-red-500 p-4 text-white w-48 rounded-md relative h-14 flex items-center justify-center"
              >
                  Submit
              </button>

        </form>
    </div>
  )
}

export default AddPage