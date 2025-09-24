import { useRef, useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import Sample from "../sample";
import Source from "../source";
import Maintenance from "../maintenance";
import Team from "../team";
import Calendar from "../calendar";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import StatCard from "../global/StatCard";

const Projector = ({ data }) => {
  const containerRef = useRef(null); // Reference to the container element
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen(); // Trigger fullscreen mode
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen(); // For Safari
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen(); // For Firefox
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen(); // For IE/Edge
      }
      setIsFullscreen(true);
    }
  };

  const handleExitFullscreen = () => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen(); // For Safari
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen(); // For Firefox
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen(); // For IE/Edge
      }
      setIsFullscreen(false);
    }
  };
  // Add event listener for the "Escape" key press as handling of exit is not automatically done
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <Box ref={containerRef}>
      {!isFullscreen && (
        <IconButton
          onClick={handleFullscreen}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <PresentToAllIcon sx={{ fontSize: "20vw" }} />
        </IconButton>
      )}
      {/* Exit Fullscreen Button */}
      {isFullscreen && (
        <>
          <IconButton
            variant="contained"
            sx={{
              fontSize: "2vh",
              position: "absolute",
              top: 10,
              right: 20,
            }}
            onClick={handleExitFullscreen}
          >
            <CancelPresentationIcon sx={{ fontSize: "3vh" }} />
          </IconButton>
          <Box
            display="flex"
            flexDirection="row"
            backgroundColor="#fff"
            padding="10px"
          >
            <Box
              sx={{
                flex: "1 1 40%",
                display: "flex",
                flexDirection: "row",
                maxHeight: "100vh",
              }}
            >
              <Box
                sx={{
                  flex: "1 1 50%",
                }}
              >
                <StatCard
                  title="Samples"
                  content={<Sample mode="projector" data={data} />}
                  mode="projector"
                />

                <StatCard
                  title="Maintenances and Faults"
                  content={<Maintenance mode="projector" data={data} />}
                  mode="projector"
                />
                <StatCard
                  title="Staff"
                  content={<Team mode="projector" data={data} />}
                  mode="projector"
                />
              </Box>
              <Box
                sx={{
                  flex: "1 1 50%",
                }}
              >
                <StatCard
                  content={<Source mode="projector" data={data} />}
                  mode="projector"
                />
              </Box>
            </Box>
            <Box
              sx={{
                flex: "1 1 50%",
                minWidth: "200px",
                maxHeight: "100vh",
              }}
            >
              <StatCard
                content={<Calendar mode="projector" data={data} />}
                mode="projector"
              />
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Projector;
