import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Input,
  Alert,
  Button,
  Textarea,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";
import { createContext, useEffect, useState, Fragment } from 'react';
import { Dialog, Transition, Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { createTask, deleteTask, findTask, getAllTask, updateTask } from "@/api/api";
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';

export function Tables() {
  const statusTak = [
    { name: 'Pending' },
    { name: 'Done' },
  ]
  const statusFilter = [
    { name: 'All' },
    { name: 'Pending' },
    { name: 'Done' },
  ]
  const [list, setList] = useState([]);
  const [createdTaskdata, setCreatedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [selected, setSelected] = useState(statusTak[0])
  const [filterData, setDataFilter] = useState(null)
  const [inputValue, setInputValue] = useState('');

  const handleEditClick = (task) => {
    setStatusUpdate(task?.status === statusTak[0].name ? statusTak[0].name : statusTak[1].name);
    setEditTask(task);
    setShowModal(true);
  };
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const setStatusUpdate = (value) => {
    setEditTask({ ...editTask, status: value.name })
  }
  const deleted = async (id) => {
    try {
      const result = await deleteTask(id, token);
      toast.success('Task deleted successfully', { position: 'top-right' });
      fetchData()
    } catch (error) {
      toast.error('Failed to delete task', { position: 'top-right' });
      console.error('Error creating task:', error);
    }
  }
  const created = async () => {
    if (!createdTaskdata || !createdTaskdata?.title || !createdTaskdata?.description) {
      toast.error('Title or description is missing', { position: 'top-right' });
      return
    }
    let data = {
      title: createdTaskdata?.title,
      description: createdTaskdata?.description,
      date: new Date(),
      status: selected.name,
      user: userId
    }
    const token = localStorage.getItem('token');
    setCreatedTask(null)
    try {
      // Gọi hàm createTask() và đợi kết quả trả về
      const response = await createTask(data, token);
      setOpenCreate(false)
      fetchData()
      toast.success('Task created successfully', { position: 'top-right' });
    } catch (error) {
      toast.error('Failed to create task', { position: 'top-right' });
      console.error('Error creating task:', error);
    }
  }
  const updateted = async () => {
    if (!editTask || !editTask?.title || !editTask?.description) {
      toast.error('Title or description is missing', { position: 'top-right' });
      return
    }
    let data = {
      title: editTask?.title,
      description: editTask?.description,
      data: editTask?.date,
      status: editTask?.status,
      user: userId
    }
    const token = localStorage.getItem('token');
    setEditTask(null)
    try {
      // Gọi hàm createTask() và đợi kết quả trả về
      const response = await updateTask(editTask?._id, data, token);
      setShowModal(false)
      fetchData()
      toast.success('Task updated successfully', { position: 'top-right' });
    } catch (error) {
      toast.error('Failed to update task', { position: 'top-right' });
      console.error('Error update task:', error);
    }
  }
  function closeModal() {
    setShowModal(false)
    setOpenCreate(false)
  }
  const fetchData = async () => {
    try {
      const data = await getAllTask(token, userId);
      if (data) {
        setList(data);
      } else {
        console.log('No data returned from getAllTask');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const setStatusFilter = async (value) => {
    setDataFilter({ ...filterData, status: value })
    let body = {
      title: filterData?.title,
      status: value?.name,
    }
    const data = await findTask(token, userId, body);
    setList(data)
  }
  const handleChangeTitle = async (e) => {
    setInputValue(e.target.value);
  }

  const handleKeyDown = async (e) => {
    if (e.keyCode === 13) {
      // Gọi hàm findTask khi người dùng ấn Enter
      let body = {
        title: inputValue,
        status: filterData?.status?.name,
      };
      const data = await findTask(token, userId, body);
      setList(data);
    }
  }
  useEffect(() => {
    fetchData()
  }, []);


  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Authors Table
          </Typography>
        </CardHeader>
        <CardBody className=" px-0 pt-0 pb-2">
          <div className="flex gap-20">
            <Button className="tw-p-6 rounded-lg border ml-4 mb-4" onClick={() => setOpenCreate(true)}>
              Add new task
            </Button>
            <div className="flex gap-4 ">
              <div>
                <Input label="Search" value={inputValue}
                  onChange={handleChangeTitle}
                  onKeyDown={handleKeyDown} />
              </div>
              <Listbox value={filterData?.status ? filterData?.status : statusFilter[0]} onChange={setStatusFilter} className=" w-[150px]">
                <div className="relative z-10 ">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{filterData?.status?.name ? filterData?.status?.name : statusFilter[0].name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {statusFilter.map((person, personIdx) => (
                        <Listbox.Option
                          key={personIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                            }`
                          }
                          value={person}
                        >
                          <>
                            <span
                              className={`block truncate ${person.name === editTask?.status ? 'font-medium' : 'font-normal'
                                }`}
                            >
                              {person.name}
                            </span>
                            {person.name === editTask?.status ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["title", "description", "status", "date", "", ""].map((el, index) => (
                  <th
                    key={index}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map(
                (item, key) => {
                  const className = `py-3 px-5 ${key === authorsTableData.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                    }`;

                  return (
                    <tr key={key}>
                      <td className={className}>
                        <div className="flex items-center gap-4">

                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {item.title}
                            </Typography>

                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {item.description}
                        </Typography>

                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={item.status === 'Pending' ? "green" : "blue-gray"}
                          value={item.status}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {moment(item?.date).format('DD/MM/YYYY HH:mm:ss')}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                          onClick={() => handleEditClick(item)}
                        >
                          Edit
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-blue-gray-600"
                          onClick={() => deleted(item._id)}
                        >
                          Delete
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
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
                    Task info
                  </Dialog.Title>
                  <div className="mt-2">
                    <form className="mt-8 mb-2 max-w-screen-lg">
                      <div className="mb-1 flex flex-col gap-6">
                      <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                          Status
                        </Typography>
                        <Listbox value={editTask?.status === statusTak[0].name ? statusTak[0].name : statusTak[1].name} onChange={setStatusUpdate}>
                          <div className="relative mt-1 z-10">
                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                              <span className="block truncate">{editTask?.status}</span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                {statusTak.map((person, personIdx) => (
                                  <Listbox.Option
                                    key={personIdx}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                      }`
                                    }
                                    value={person}
                                  >
                                    <>
                                      <span
                                        className={`block truncate ${person.name === editTask?.status ? 'font-medium' : 'font-normal'
                                          }`}
                                      >
                                        {person.name}
                                      </span>
                                      {person.name === editTask?.status ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                          Title
                        </Typography>
                        <Input
                          type="text"
                          size="lg"
                          className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                          labelProps={{
                            className: "before:content-none after:content-none",
                          }}
                          value={editTask?.title}
                          onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                        />
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                          description
                        </Typography>
                        <Textarea
                          className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                          labelProps={{
                            className: "before:content-none after:content-none",
                          }}
                          value={editTask?.description}
                          onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                        />
                      </div>

                    </form>
                  </div>

                  <div className="mt-4 flex gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent  px-4 py-2 text-sm font-medium text-white  bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={updateted}
                    >
                      update
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-blue-400 border-blue-400 focus:outline-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
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
      <Transition appear show={openCreate} as={Fragment}>
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
                    Create Task
                  </Dialog.Title>
                  <div className="mt-2">
                    <form className="mt-8 mb-2 max-w-screen-lg">
                      <div className="mb-1 flex flex-col gap-6">
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                          Status
                        </Typography>
                        <Listbox value={selected} onChange={setSelected}>
                          <div className="relative mt-1 z-10">
                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                              <span className="block truncate">{selected.name}</span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                {statusTak.map((person, personIdx) => (
                                  <Listbox.Option
                                    key={personIdx}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                      }`
                                    }
                                    value={person}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                            }`}
                                        >
                                          {person.name}
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                          title
                        </Typography>
                        <Input
                          type="text"
                          size="lg"
                          className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                          labelProps={{
                            className: "before:content-none after:content-none",
                          }}
                          onChange={(e) => setCreatedTask({ ...createdTaskdata, title: e.target.value })}
                        />
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                          description
                        </Typography>
                        <Textarea
                          className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                          labelProps={{
                            className: "before:content-none after:content-none",
                          }}
                          onChange={(e) => setCreatedTask({ ...createdTaskdata, description: e.target.value })}
                        />
                      </div>

                    </form>
                  </div>

                  <div className="mt-4 flex gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent  px-4 py-2 text-sm font-medium text-white  bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={created}
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-blue-400 border-blue-400 focus:outline-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
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
    </div>
  );
}

export default Tables;
