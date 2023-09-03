"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState } from "react";

type Inputs = {
    title: string;
    desc: string;
    price: number;
    catSlug: string;
};

type Option = {
    title: string;
    additionalPrice: number;
};



const AddPage = () => {

  const { data: session, status } = useSession();

  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    price: 0,
    catSlug: "",
  });

  const[option, setOption] = useState<Option>({
    title:"",
    additionalPrice: 0,
  });

  const[options, setOptions] = useState<Option[]>([]);

  const router = useRouter();

  if(status === 'loading'){
    return <p>Loading....</p>
  }

  if( status === "unauthenticated" || !session?.user.isAdmin ){
    router.push("/");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInputs((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
      });  
  };

    const changeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOption((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            const res = await fetch("http://localhost:3000/api/products", {
                method: "POST",
                body: JSON.stringify({
                    ...inputs,
                    options,
                }),
            });

            const data = await res.json();

            router.push(`/product/${data.id}`);

        } catch (error) {
            console.log(error);
        }
    }


  return (
      <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex items-center justify-center text-red-500">
          <form className="flex flex-wrap gap-6" onSubmit={ handleSubmit }>
              <h1 className="text-4xl mb-2 text-gray-300 font-bold">Add New Product</h1>
              
              <div className="w-full flex flex-col gap-2 ">
                <label className="text-sm">Title</label>
                <input 
                    type="text" 
                    name="title"
                    placeholder="Bella Napoli"
                    className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none" 
                    onChange={handleChange}
                />
              </div>

              <div className="text-sm cursor-pointer flex gap-4 items-center">
                <label className="text-sm">Desc</label>
                <textarea 
                    rows={3}
                    name="desc" 
                    placeholder="A timeless favorite with a twist, showcasing a thin crust topped with sweet tomatoes, fresh basil and creamy mozzarella."
                    className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
                    onChange={handleChange}
                />
              </div>

              <div className="text-sm cursor-pointer flex gap-4 items-center">
                <label className="text-sm">Price</label>
                <input 
                    type="number" 
                    name="price"
                    placeholder="29"
                    className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none" 
                    onChange={handleChange}
                />
              </div>

              <div className="text-sm cursor-pointer flex gap-4 items-center">
                <label className="text-sm">Category</label>
                <input 
                    type="text" 
                    name="category"
                    placeholder="pizzas"
                    className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
                    onChange={handleChange}
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
                        onChange={changeOption}
                    />
                    <input 
                        type="number" 
                        placeholder="additionalPrice" 
                        name="additionalPrice" 
                        className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"    
                        onChange={changeOption}
                    />
                    <div 
                        className="bg-gray-500 p-2 text-white"
                        onClick={() => setOptions((prev) => [...prev, option])}
                    >
                        Add Option
                    </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-2">
                { options.map((item) => (
                    <div 
                        className="p-2  rounded-md cursor-pointer bg-gray-200 text-gray-400" 
                        key={item.title}
                        onClick={() => setOptions((prev) =>
                            prev.filter((opt) => item.title !== opt.title)
                        )}    
                    >
                        <span>{item.title}</span>
                        <span className="text-xs">${item.additionalPrice}</span>
                    </div>
                ))}
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