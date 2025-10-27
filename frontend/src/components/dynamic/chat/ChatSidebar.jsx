import React from "react";
import { Avatar, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Switch from "@mui/material/Switch";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
// my icons
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

function Sidebar({ chats, setSelectedChat }) {
  const [direction, setDirection] = React.useState("up");
  const [hidden, setHidden] = React.useState(false);
  const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: "absolute",
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  }));

  const actions = [
    { icon: <PersonAddIcon />, name: "Add New Contact" },
    { icon: <GroupAddIcon />, name: "Create New Group" },
    { icon: <PrintIcon />, name: "Print" },
    { icon: <ShareIcon />, name: "Share" },
  ];

  // const handleDirectionChange = (event) => {
  //   setDirection(event.target.value);
  // };

  const handleHiddenChange = (event) => {
    setHidden(event.target.checked);
  };
  return (
    <div className="w-1/4 bg-[#6C63FF] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <Avatar sx={{ bgcolor: "#25D366" }}>U</Avatar>
        <div className="flex space-x-2">
          <IconButton sx={{ color: "white" }}>
            <SearchIcon />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      {/* Search */}
      <div className="p-2">
        <div className="flex items-center bg-darkAccent rounded-full p-2">
          <SearchIcon className="text-gray-400" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="bg-darkAccent flex-1 ml-2 outline-none text-white"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center p-4 hover:bg-darkAccent cursor-pointer"
            onClick={() => setSelectedChat(chat)}
          >
            <Avatar sx={{ bgcolor: "#075E54" }}>{chat.name[0]}</Avatar>
            <div className="ml-4">
              <p className="font-semibold">{chat.name}</p>
              <p className="text-gray-400 text-sm">{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>

      <Box sx={{ position: "relative", mt: 3, height: 320 }}>
        <StyledSpeedDial
          ariaLabel="SpeedDial playground example"
          hidden={hidden}
          icon={<SpeedDialIcon />}
          direction={direction}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              slotProps={{
                tooltip: {
                  title: action.name,
                },
              }}
            />
          ))}
        </StyledSpeedDial>
      </Box>
    </div>
  );
}

export default Sidebar;
