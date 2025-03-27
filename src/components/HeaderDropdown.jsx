import React from "react";
import { useDispatch, useSelector } from "react-redux";
import boardIcon from "../assets/icon-board.svg"
import boardsSlice from "../redux/boardSlice";


const HeaderDropdown = ({ setOpenDropdown, setBoardModalOpen }) => {
  const boards = useSelector((state) => state.boards);
  const dispatch = useDispatch();
  console.log("Boards:", boards);
  return (
    <div
      onClick={(e) => {
        if (e.target != e.currentTarget) {
          return;
        }
        setOpenDropdown(false);
      }}
      className=" absolute py-10 px-6 left-0 right-0 bottom-[-100vh] top-16 bg-[#00000080]"
    >
      {/* Dropdown modal */}
      <div className=" bg-white shadow-md shadow-[#364e7e1a]  w-full py-4 rounded-xl">
        <h3 className=" text-gray-600 font-semibold mx-4 mb-8 ">
          All Boards ({boards?.length})
        </h3>
        <div>
          {boards?.map((board, idx) => {
            return (
              <div
                key={idx}
                onClick={()=>{
                    dispatch(boardsSlice.actions.setBoardActive({index:idx}))
                }}
                className={` flex items-baseline space-x-2 px-5 py-4  ${
                  board.isActive &&
                  " bg-[#635fc7] rounded-r-full text-white mr-8 "
                } `}
              >
                <img src={boardIcon} alt="board icon" className=" h-4" />
                <p className=" text-lg font-bold">
                    {board.name}
                </p>
              </div>
            );
          })}
          <div onClick={()=>{
            setBoardModalOpen(true);
            setOpenDropdown(false);
          }} className=" cursor-pointer flex items-baseline space-x-2 text-[#635fc7] px-5 py-4">
            <img src={boardIcon} alt="board icon" className=" h-4" />
            <p className=" text-lg font-bold">Create New Board</p>

          </div>
        
        </div>
      </div>
    </div>
  );
};

export default HeaderDropdown;
