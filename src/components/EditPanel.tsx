import React from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGlassStore } from '../store/useGlassStore';

const EditPanel: React.FC = () => {
  const {
    background,
    glassMorphism,
    setPattern,
    setSpatialFrequency,
    setScrollSpeed,
    setBlurStrength,
    setOpacity,
  } = useGlassStore();

  return (
    <div className="w-full h-full bg-gray-800 p-6 overflow-y-auto">
      <h2 className="text-white text-xl font-bold mb-6">パラメータ調整</h2>
      
      {/* Background Control */}
      <Accordion 
        defaultExpanded 
        sx={{ 
          bgcolor: 'rgb(31, 41, 55)', 
          color: 'white',
          mb: 2 
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
          <Typography>背景制御</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>パターン</InputLabel>
            <Select
              value={background.pattern}
              label="パターン"
              onChange={(e) => setPattern(e.target.value as any)}
              sx={{ 
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
              }}
            >
              <MenuItem value="stripe">矩形波（ストライプ）</MenuItem>
              <MenuItem value="checkerboard">市松模様</MenuItem>
              <MenuItem value="sine">サイン波</MenuItem>
            </Select>
          </FormControl>
          
          <Typography gutterBottom sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            空間周波数: {background.spatialFrequency}px
          </Typography>
          <Slider
            value={background.spatialFrequency}
            onChange={(_, value) => setSpatialFrequency(value as number)}
            min={10}
            max={200}
            valueLabelDisplay="auto"
            sx={{ color: 'rgb(59, 130, 246)' }}
          />
        </AccordionDetails>
      </Accordion>

      {/* Glass UI Control */}
      <Accordion 
        defaultExpanded
        sx={{ 
          bgcolor: 'rgb(31, 41, 55)', 
          color: 'white',
          mb: 2 
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
          <Typography>グラスモーフィズム</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography gutterBottom sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            ブラー強度: {glassMorphism.blurStrength}px
          </Typography>
          <Slider
            value={glassMorphism.blurStrength}
            onChange={(_, value) => setBlurStrength(value as number)}
            min={0}
            max={50}
            valueLabelDisplay="auto"
            sx={{ color: 'rgb(59, 130, 246)', mb: 3 }}
          />
          
          <Typography gutterBottom sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            透明度: {(glassMorphism.opacity * 100).toFixed(0)}%
          </Typography>
          <Slider
            value={glassMorphism.opacity}
            onChange={(_, value) => setOpacity(value as number)}
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
            sx={{ color: 'rgb(59, 130, 246)' }}
          />
        </AccordionDetails>
      </Accordion>

      {/* Animation Control */}
      <Accordion 
        sx={{ 
          bgcolor: 'rgb(31, 41, 55)', 
          color: 'white' 
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
          <Typography>アニメーション</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography gutterBottom sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            スクロール速度: {background.scrollSpeed.toFixed(1)}
          </Typography>
          <Slider
            value={background.scrollSpeed}
            onChange={(_, value) => setScrollSpeed(value as number)}
            min={0}
            max={10}
            step={0.1}
            valueLabelDisplay="auto"
            sx={{ color: 'rgb(59, 130, 246)' }}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default EditPanel;
