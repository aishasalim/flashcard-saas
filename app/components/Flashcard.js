import { Paper, Stack, Typography } from "@mui/material"

export default function Flashcard({hover, rotate, cardColor, title, date, content}) {
  return (
    <Paper
      square
      elevation={3}
      sx={{
        minWidth: '308px',
        minHeight: '109.7px',
        maxWidth: '444.93px',
        rotate: `${rotate}deg`,
        backgroundColor: `${cardColor}`,
        transition: 'transform ease-in-out 0.2s',
        '&:hover' : {
          transform: `${hover && 'translateY(-10px) rotate(2deg)'}`,
        },
        p:2}} >
          <Stack mb={2} direction={'row'} justifyContent={'space-between'}>
            <Typography sx={{fontSize: '1.5rem', fontWeight: 'bold'}}>{title}</Typography>
            <Typography sx={{fontSize: '1.5rem', fontWeight: 'bold'}}>{date}</Typography>
          </Stack>
          <Typography sx={{fontSize: '1.25rem'}}>{content}</Typography>
    </Paper>
  )
} 