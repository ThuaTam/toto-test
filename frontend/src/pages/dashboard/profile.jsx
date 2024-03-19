import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Input,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { platformSettingsData, conversationsData, projectsData } from "@/data";
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { createContext, useEffect, useState, Fragment } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { getUserById, updateUser } from "@/api/api";

export function Profile() {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const [showModal, setShowModal] = useState(false);
  function closeModal() {
    setShowModal(false)
  }
  const [infoUser, setInfoUser] = useState(null);

  const updateted = async () => {
    if (!infoUser || !infoUser?.fullname || !infoUser?.mobile || !infoUser?.email) {
      toast.error('is missing', { position: 'top-right' });
      return
    }
    let data = {
      fullname: infoUser?.fullname,
      mobile: infoUser?.mobile,
      email: infoUser?.email,
    }
    const token = localStorage.getItem('token');
    try {
      // Gọi hàm createTask() và đợi kết quả trả về
      const response = await updateUser(userId,data, token);
      setShowModal(false)
      fetchData()
      toast.success('User updated successfully', { position: 'top-right' });
    } catch (error) {
      toast.error('Failed to update User', { position: 'top-right' });
      console.error('Error update User:', error);
    }
  }
  function closeModal() {
    setShowModal(false)
    setOpenCreate(false)
  }
  const fetchData = async () => {
    try {
      const data = await getUserById(token, userId);
      if (data) {
        setInfoUser(data);
      } else {
        console.log('No data returned from getAllTask');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData()
  }, []);
  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src="/img/bruce-mars.jpeg"
                alt="bruce-mars"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {infoUser?.fullname}
                </Typography>
               
              </div>
            </div>
          </div>
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 ">  
            <ProfileInfoCard
              title="Profile Information"
              description="Hi, I'm Alec Thompson, Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
              details={{
                "Name": infoUser?.fullname,
                mobile: infoUser?.mobile,
                email: infoUser?.email,
                
              }}
              action={
                <Tooltip content="Edit Profile">
                  <PencilIcon className="h-6 w-6 cursor-pointer text-blue-gray-500" onClick={() => setShowModal(true)}/>
                </Tooltip>
              }
            />
            
          </div>
    
        </CardBody>
      </Card>
      <Transition appear show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center  p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[600px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    User info
                  </Dialog.Title>
                  <div className="mt-2">
                    <form className="mt-8 mb-2 max-w-screen-lg">
                      <div className="mb-1 flex flex-col gap-6">
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                          Full Name
                        </Typography>
                        <Input
                          type="text"
                          size="lg"
                          className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                          labelProps={{
                            className: "before:content-none after:content-none",
                          }}
                          value={infoUser?.fullname}
                          onChange={(e) => setInfoUser({ ...infoUser, fullname: e.target.value })}
                        />
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                          Email
                        </Typography>
                        <Input
                          type="text"
                          size="lg"
                          className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                          labelProps={{
                            className: "before:content-none after:content-none",
                          }}
                          value={infoUser?.email}
                          onChange={(e) => setInfoUser({ ...infoUser, email: e.target.value })}
                        />
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                          Mobile
                        </Typography>
                        <Input
                          type="text"
                          size="lg"
                          className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                          labelProps={{
                            className: "before:content-none after:content-none",
                          }}
                          value={infoUser?.mobile}
                          onChange={(e) => setInfoUser({ ...infoUser, mobile: e.target.value })}
                        />
                      </div>

                    </form>
                  </div>

                  <div className="mt-4 flex gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent  px-4 py-2 text-sm font-medium text-white  bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => updateted()}
                    >
                      update
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-blue-400 border-blue-400 focus:outline-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setShowModal(false)}
                    >
                      cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <ToastContainer />
    </>
  );
}

export default Profile;
