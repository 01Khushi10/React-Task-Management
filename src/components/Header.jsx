import React, { useState } from "react";
import logo from "../assets/logo-mobile.svg";
import iconUp from "../assets/icon-chevron-up.svg";
import iconDown from "../assets/icon-chevron-down.svg";
import elipsis from "../assets/icon-vertical-ellipsis.svg";
import HeaderDropdown from "./HeaderDropdown";
import AddEditBoardModal from "../modals/AddEditBoardModal";
import { useDispatch, useSelector } from "react-redux";
import AddEditTaskModal from "../modals/AddEditTaskModal";
import ElipsisMenu from "./ElipsisMenu";
import boardsSlice from "../redux/boardSlice";
import DeleteModal from "../modals/DeleteModal";

const Header = ({ boardModalOpen, setBoardModalOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openAddEditTask, setOpenAddEditTask] = useState(false);
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards);
  const board = useSelector((state) =>
    state.boards.find((b) => b.isActive)
  ) || { name: "No Active Board" };

  const [boardType, setBoardType] = useState("add");
  const setOpenEditModal = () => {
    setBoardModalOpen(true);
    setIsElipsisMenuOpen(false);
  };
  const setOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setIsElipsisMenuOpen(false);
  };
  const onDropdownClick = () => {
    setOpenDropdown((state) => !state);
    setIsElipsisMenuOpen(false);
    setBoardType("add");
  };
  const onDeleteBtnClick = (e) => {
    if (e.target.textContent === "Delete") {
      dispatch(boardsSlice.actions.deleteBoard());
      dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className=" p-4 fixed left-0 bg-white z-50 right-0">
      <header className=" flex justify-between items-center">
        {/* Left Side */}
        <div className=" flex items-center space-x-2 md:space-x-4">
          <img src={logo} alt="logo" className=" h-6 w-6" />
          <h3 className=" hidden md:inline-block font-bold font-sans md:text-4xl">
            Kanban
          </h3>
          <div className=" flex items-center">
            <h3 className=" truncate max-w-[200px] md:text-2xl text-xl font-bold md:ml-20 font-sans">
              {board.name}
            </h3>
            <img
              src={openDropdown ? iconUp : iconDown}
              alt="dropdown icon"
              className=" -3 ml-2 md:hidden cursor-pointer"
              onClick={onDropdownClick}
            />
          </div>
        </div>
        {/* Right Side */}
        <div className=" flex space-x-4 items-center md:space-x-6">
          <button onClick={() => {
              setOpenAddEditTask((prevState) => !prevState);
            }} className=" hidden md:block bg-[#635fc7] py-2 px-4 rounded-full text-white text-lg font-semibold hover:opacity-80 duration-200">
            + Add New Task
          </button>
          <button
            onClick={() => {
              setOpenAddEditTask((state) => !state);
            }}
            className=" bg-[#635fc7] rounded-full text-white text-lg font-semibold hover:opacity-80 duration-200 py-1 px-3 md:hidden"
          >
            +
          </button>
          <img onClick={()=>{
            setBoardType("edit");
            setOpenDropdown(false);
            setIsElipsisMenuOpen(state => !state)
          }} src={elipsis} alt="elipsis" className=" cursor-pointer text-right h-6" />
          {
            isElipsisMenuOpen && <ElipsisMenu type="Boards" setOpenDeleteModal={setOpenDeleteModal} setOpenEditModal={setOpenEditModal} />
          }
        </div>
      </header>
      {openDropdown && (
        <HeaderDropdown
          setBoardModalOpen={setBoardModalOpen}
          setOpenDropdown={setOpenDropdown}
        />
      )}

      {boardModalOpen && (
        <AddEditBoardModal
          type={boardType}
          setBoardModalOpen={setBoardModalOpen}
        />
      )}
      {/* DEBUG REQUIRED */}
      {openAddEditTask && (
        <AddEditTaskModal
          type="add"
          setOpenAddEditTask={setOpenAddEditTask}
          device="mobile"
        />
      )}
      {
        isDeleteModalOpen && <DeleteModal
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        type="board"
        title={board.name}
        onDeleteBtnClick={onDeleteBtnClick}
      />
      }
    </div>
  );
};

export default Header;
