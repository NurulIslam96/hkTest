import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Spinner from "./Spinner";
import { toast } from "react-hot-toast";

const Save = () => {
  const [userId, setUserId] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    data: selectData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const url = "https://hktest.vercel.app/data";
      const res = await fetch(url);
      const data = await res.json();
      return data;
    },
  });

  const { data: prevUserData } = useQuery({
    queryKey: ["prevUserData"],
    queryFn: async () => {
      const res = await fetch("https://hktest.vercel.app/userdata");
      const data = await res.json();
      setUserId(data[0]._id);
      return data;
    },
  });

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const selection = e.target.selected.value;
    const checkbox = e.target.checkbox.checked;
    if (name && selection && checkbox) {
      const details = {
        name,
        selection,
        agreement: "accepted",
      };
      fetch(`https://hktest.vercel.app/edit/${userId || "noid"}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(details),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.modifiedCount > 0) {
            toast.success("Edited Successfully");
            setIsDisabled(true);
            refetch();
          } else if (data.insertedId) {
            setIsDisabled(true);
            toast.success("Data Added Successfully");
          } else {
            toast.error("Same Data cannot be saved again");
          }
        });
    } else {
      toast.error("Please Enter All the details and Check terms agreement");
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full mx-2 max-w-md p-8 space-y-3 rounded-xl bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-bold text-center">Save Details</h1>
      <form
        onSubmit={(e) => handleSubmitForm(e)}
        className="space-y-6 ng-untouched ng-pristine ng-valid"
      >
        <div className="space-y-1 text-sm">
          <label className="block text-gray-400">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            defaultValue={`${prevUserData ? prevUserData[0]?.name : ""}`}
            disabled={isDisabled}
            className="w-full px-4 py-3 rounded-md border-gray-700 bg-gray-900 text-gray-100 focus:border-violet-400"
          />
        </div>
        <div className="space-y-1 text-sm">
          <label className="block text-gray-400">Sectors</label>
          <select
            name="selected"
            disabled={isDisabled}
            defaultValue={
              prevUserData ? prevUserData[0].selection : selectData[0].option
            }
            className="select select-bordered w-full rounded-md border-gray-700 bg-gray-900 text-gray-100 focus:border-violet-400"
            style={{ color: isDisabled ? "black" : "" }}
          >
            {selectData &&
              selectData.map((data) => (
                <React.Fragment key={data._id}>
                  <option key={data.id}>{data.option}</option>
                  {data?.menu &&
                    data.menu.map((opt, i) => (
                      <React.Fragment key={i}>
                        <option>&nbsp;&nbsp;&nbsp;&nbsp;{opt.suboption}</option>
                        {opt?.submenu &&
                          opt.submenu.map((menu, i) => (
                            <React.Fragment key={i}>
                              <option>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                {menu.suboption1}
                              </option>
                              {menu?.submenu1 &&
                                menu.submenu1.map((sbmenu, i) => (
                                  <option key={i}>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    {sbmenu.suboption2}
                                  </option>
                                ))}
                            </React.Fragment>
                          ))}
                      </React.Fragment>
                    ))}
                </React.Fragment>
              ))}
          </select>
          <div className="flex pt-2 justify-start items-center text-sm gap-2 text-gray-400">
            <input
              type="checkbox"
              className="checkbox checkbox-accent"
              name="checkbox"
              id=""
            />
            <p rel="noopener noreferrer" href="#">
              Agree to terms
            </p>
          </div>
        </div>
        <button className="block w-full p-3 text-center rounded-sm text-gray-900 bg-violet-400">
          Save
        </button>
        <label
          onClick={() => {
            setIsDisabled(false);
            toast.success("Now you can edit");
          }}
          className="cursor-pointer block w-full p-3 text-center rounded-sm text-gray-900 bg-violet-400"
          style={{ backgroundColor: !isDisabled && "orange" }}
        >
          Edit
        </label>
      </form>
    </div>
  );
};

export default Save;
