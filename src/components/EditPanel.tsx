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
  Switch,
  FormControlLabel,
  Button,
  Box,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useGlassStore } from '../store/useGlassStore';
import { PHONE_FRAME_SIZE } from './PhoneFrame';

const EditPanel: React.FC = () => {
  const {
    background,
    glassMorphism,
    setPattern,
    setSpatialFrequency,
    setScrollSpeed,
    setAutoScroll,
    setBlurStrength,
    setOpacity,
    setBorderOpacity,
    setGlassSize,
    setBorderRadius,
    setGlassPosition,
    setShadowEnabled,
    resetAll,
    resetBackground,
    resetGlassMorphism,
  } = useGlassStore();

  return (
    <div className="w-full h-full bg-gray-800 p-6 overflow-y-auto">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <h2 className="text-white text-xl font-bold">パラメータ調整</h2>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RestartAltIcon />}
          onClick={resetAll}
          sx={{
            color: 'rgb(59, 130, 246)',
            borderColor: 'rgb(59, 130, 246)',
            '&:hover': {
              borderColor: 'rgb(96, 165, 250)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
            },
          }}
        >
          全リセット
        </Button>
      </Box>

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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 2 }}>
            <Typography>背景制御</Typography>
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                resetBackground();
              }}
              sx={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.75rem',
                minWidth: 'auto',
                padding: '2px 8px',
                '&:hover': {
                  color: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                },
              }}
            >
              リセット
            </Button>
          </Box>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 2 }}>
            <Typography>グラスモーフィズム</Typography>
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                resetGlassMorphism();
              }}
              sx={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.75rem',
                minWidth: 'auto',
                padding: '2px 8px',
                '&:hover': {
                  color: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                },
              }}
            >
              リセット
            </Button>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {/* マテリアル */}
          <Typography variant="subtitle2" sx={{ color: 'rgb(59, 130, 246)', mb: 2, fontWeight: 'bold' }}>
            マテリアル
          </Typography>

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
            α値（不透明度）: {(glassMorphism.opacity * 100).toFixed(0)}%
          </Typography>
          <Slider
            value={glassMorphism.opacity}
            onChange={(_, value) => setOpacity(value as number)}
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
            sx={{ color: 'rgb(59, 130, 246)', mb: 3 }}
          />

          <Typography gutterBottom sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            ボーダー透明度: {(glassMorphism.borderOpacity * 100).toFixed(0)}%
          </Typography>
          <Slider
            value={glassMorphism.borderOpacity}
            onChange={(_, value) => setBorderOpacity(value as number)}
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
            sx={{ color: 'rgb(59, 130, 246)', mb: 3 }}
          />

          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

          {/* ジオメトリ */}
          <Typography variant="subtitle2" sx={{ color: 'rgb(59, 130, 246)', mb: 2, fontWeight: 'bold' }}>
            ジオメトリ
          </Typography>

          <Typography gutterBottom sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            幅: {glassMorphism.width}px
          </Typography>
          <Slider
            value={glassMorphism.width}
            onChange={(_, value) => setGlassSize(value as number, glassMorphism.height)}
            min={0}
            max={PHONE_FRAME_SIZE.width}
            valueLabelDisplay="auto"
            sx={{ color: 'rgb(59, 130, 246)', mb: 3 }}
          />

          <Typography gutterBottom sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            高さ: {glassMorphism.height}px
          </Typography>
          <Slider
            value={glassMorphism.height}
            onChange={(_, value) => setGlassSize(glassMorphism.width, value as number)}
            min={0}
            max={PHONE_FRAME_SIZE.height}
            valueLabelDisplay="auto"
            sx={{ color: 'rgb(59, 130, 246)', mb: 3 }}
          />

          <Typography gutterBottom sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            角丸: {glassMorphism.borderRadius}px
          </Typography>
          <Slider
            value={glassMorphism.borderRadius}
            onChange={(_, value) => setBorderRadius(value as number)}
            min={0}
            max={50}
            valueLabelDisplay="auto"
            sx={{ color: 'rgb(59, 130, 246)', mb: 3 }}
          />

          <Typography gutterBottom sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            X位置: {glassMorphism.positionX}%
          </Typography>
          <Slider
            value={glassMorphism.positionX}
            onChange={(_, value) => setGlassPosition(value as number, glassMorphism.positionY)}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            sx={{ color: 'rgb(59, 130, 246)', mb: 3 }}
          />

          <Typography gutterBottom sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            Y位置: {glassMorphism.positionY}%
          </Typography>
          <Slider
            value={glassMorphism.positionY}
            onChange={(_, value) => setGlassPosition(glassMorphism.positionX, value as number)}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            sx={{ color: 'rgb(59, 130, 246)' }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={glassMorphism.isShadowEnabled}
                onChange={(e) => setShadowEnabled(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'rgb(59, 130, 246)',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'rgb(59, 130, 246)',
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
                ドロップシャドウを有効化
              </Typography>
            }
            sx={{ mb: 2 }}
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
          <FormControlLabel
            control={
              <Switch
                checked={background.isAutoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'rgb(59, 130, 246)',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'rgb(59, 130, 246)',
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
                自動スクロール
              </Typography>
            }
            sx={{ mb: 2 }}
          />

          <Typography gutterBottom sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            スクロール速度: {background.scrollSpeed.toFixed(1)}
          </Typography>
          <Slider
            value={background.scrollSpeed}
            onChange={(_, value) => setScrollSpeed(value as number)}
            min={0}
            max={30}
            step={0.1}
            valueLabelDisplay="auto"
            disabled={!background.isAutoScroll}
            sx={{ color: 'rgb(59, 130, 246)' }}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default EditPanel;
