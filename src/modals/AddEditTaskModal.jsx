import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import crossIcon from "../assets/icon-cross.svg";
import { useDispatch, useSelector } from "react-redux";
import boardsSlice from "../redux/boardSlice";

const AddEditTaskModal = ({ type, device, setOpenAddEditTask, prevColIndex = 0, taskIndex }) => {
  const [title, setTitle] = useState("");
  const [isValid, setIsValid] = useState(true);
    const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const [subtasks, setSubtasks] = useState([
    { title: "", isCompleted: false, id: uuidv4() },
    { title: "", isCompleted: false, id: uuidv4() },
  ]);
  const board = useSelector((state) => state.boards).find(
    (board) => board.isActive
  );

  const columns = board.columns;
  const col = columns.find((col, index) => index === prevColIndex);
  const task = col ? col.tasks.find((task, index) => index === taskIndex) : [];
  const [status, setStatus] = useState(columns[prevColIndex].name);
  const [newColIndex, setNewColIndex] = useState(prevColIndex);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const onDelete = (id) => {
    setSubtasks((prevState) => prevState.filter((el) => el.id !== id));
  };
  const onChangeStatus = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const onChangeSubtasks = (id, newValue) => {
    setSubtasks((prevState) => {
      const newState = [...prevState];
      const subtask = newState.find((subtask) => subtask.id === id);
      subtask.title = newValue;
      return newState;
    });
  };
  const validate = () => {
    setIsValid(false);
    if (!title.trim()) {
      return false;
    }
    for (let i = 0; i < subtasks.length; i++) {
      if (!subtasks[i].title.trim()) {
        return false;
      }
    }
    setIsValid(true);
    return true;
  };
  const onSubmit = (type) => {
    if (type === "add") {
      dispatch(
        boardsSlice.actions.addTask({
          title,
          description,
          subtasks,
          status,
          newColIndex,
        })
      );
    } else {
      dispatch(
        boardsSlice.actions.editTask({
          title,
          description,
          subtasks,
          status,
          taskIndex,
          prevColIndex,
          newColIndex,
        })
      );
    }
  };
  if (type === "edit" && isFirstLoad) {
    setSubtasks(
      task.subtasks.map((subtask) => {
        return { ...subtask, id: uuidv4() };
      })
    );
    setTitle(task.title);
    setDescription(task.description);
    setIsFirstLoad(false);
  }
  return (
    <div
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenAddEditTask(false);
      }}
      className={
        device === "mobile"
          ? "  py-6 px-6 pb-40  absolute overflow-y-scroll left-0 flex items-center  right-0 bottom-[-100vh] top-0 dropdown "
          : "  py-6 px-6 pb-40  absolute overflow-y-scroll left-0 flex  items-center right-0 bottom-0 top-0 dropdown "
      }
    >
      {/* Modal Section */}
      <div className=" mt-8 scrollbar-hide overflow-y-scroll max-h-[95vh] bg-white text-black font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto w-full px-8 py-8 rounded-xl">
        <h3 className=" text-lg">
          {type === "edit" ? "Edit" : "Add New"} Task
        </h3>
        {/* Task Name */}
        <div className=" mt-8 flex flex-col space-y-1">
          <label className="text-sm text-gray-500">Task Name</label>
          <input
            type="text"
            placeholder="e.g Take coffee break"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent px-4 py-2 outline-none focus:border-0 rounded-md text-sm border border-gray-600 focus:outline-[#635fc7] ring-0"
          />
        </div>
        {/* Description */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="  text-sm text-gray-500">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="task-description-input"
            className=" bg-transparent outline-none min-h-[200px] focus:border-0 px-4 py-2 rounded-md text-sm  border-[0.5px] border-gray-600 focus:outline-[#635fc7] outline-[1px] "
            placeholder="e.g. It's always good to take a break. This 15 minute break will  recharge the batteries a little."
          />
        </div>
        {/* Subtasks Section */}
        <div className="mt-8 flex flex-col space-y-1">
          <label className="  text-sm text-gray-500">Subtasks</label>
          {subtasks.map((subtask, idx) => {
            return (
              <div key={idx} className=" flex items-center w-full">
                <input
                  type="text"
                  value={subtask.title}
                  className=" bg-transparent outline-none focus:border-0 flex flex-grow px-4 py-2 rounded-md text-sm border border-gray-600 focus:outline-[#635fc7]"
                  placeholder="e.g Take coffee break"
                  onChange={(e) => onChangeSubtasks(subtask.id, e.target.value)}
                />
                <img
                  src={crossIcon}
                  alt="cross icon"
                  onClick={() => {
                    onDelete(subtask.id);
                  }} className=" cursor-pointer m-4"
                />
              </div>
            );
          })}
          <button
          onClick={()=>{
            setSubtasks((prevState) => [
             ...prevState,
              { title: "", isCompleted: false, id: uuidv4() },
            ]);
          }}
        className=" w-full items-center text-white bg-[#635fc7] py-2 rounded-full">
            + Add New Subtask
          </button>
        </div>
        {/* Current Status Section */}
        <div className=" mt-8 flex flex-col space-y-3">
            <label className=" text-sm text-gray-500">
                Current Status
            </label>
            <select
            value={status} onChange={onChangeStatus}
            className=" select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0  border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none"
          >
            {columns.map((column, index) => (
              <option key={index}>{column.name}</option>
            ))}
          </select>
          <button onClick={() => {
              const isValid = validate();
              if (isValid) {
                onSubmit(type);
                type === "edit" && setOpenAddEditTask(false);
              }
              setOpenAddEditTask(false);
            }} className=" w-full items-center text-white bg-[#635fc7] py-2 rounded-full ">
            {type === "edit" ? 'Edit' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditTaskModal;
