/**
 * VioCreate - 莱米多媒体创作工具 前端逻辑
 * 仅实现页面跳转与交互，不包含后端功能
 */

(function () {
  'use strict';

  // ---------- Toast 提示 ----------
  function ensureToastContainer() {
    let el = document.getElementById('toast-container');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast-container';
      el.className = 'toast-container';
      document.body.appendChild(el);
    }
    return el;
  }

  function toast(message, type = 'info') {
    const container = ensureToastContainer();
    const div = document.createElement('div');
    div.className = 'toast ' + (type === 'success' ? 'success' : 'info');
    div.textContent = message;
    container.appendChild(div);
    setTimeout(function () {
      div.remove();
    }, 2500);
  }

  window.toast = toast;

  // ---------- 视图切换 ----------
  function switchView(viewId) {
    const dashboard = document.getElementById('dashboardView');
    const project = document.getElementById('projectView');
    if (!dashboard || !project) return;

    if (viewId === 'projectView') {
      dashboard.classList.add('hidden');
      project.classList.remove('hidden');
      window.location.hash = 'project';
    } else {
      dashboard.classList.remove('hidden');
      project.classList.add('hidden');
      window.location.hash = '';
    }
  }

  window.switchView = switchView;

  // ---------- 模态框 ----------
  function toggleModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.toggle('hidden');
  }

  window.toggleModal = toggleModal;

  // ---------- 人物列表弹窗 ----------
  function updateCharCount() {
    var el = document.getElementById('charPrompt');
    var countEl = document.getElementById('charCount');
    if (el && countEl) countEl.textContent = (el.value || '').length;
  }
  function closeAddCharacterModal() {
    var nameEl = document.getElementById('charName');
    var promptEl = document.getElementById('charPrompt');
    var nameErr = document.getElementById('charNameError');
    var promptErr = document.getElementById('charPromptError');
    if (nameEl) nameEl.value = '';
    if (promptEl) promptEl.value = '';
    if (nameErr) nameErr.classList.add('hidden');
    if (promptErr) promptErr.classList.add('hidden');
    updateCharCount();
    toggleModal('addCharacterModal');
  }
  function validateAndSubmitCharacter() {
    var name = (document.getElementById('charName') && document.getElementById('charName').value) || '';
    var prompt = (document.getElementById('charPrompt') && document.getElementById('charPrompt').value) || '';
    var nameErr = document.getElementById('charNameError');
    var promptErr = document.getElementById('charPromptError');
    if (nameErr) nameErr.classList.add('hidden');
    if (promptErr) promptErr.classList.add('hidden');
    var valid = true;
    if (!name.trim()) {
      if (nameErr) { nameErr.textContent = '请输入人物名称'; nameErr.classList.remove('hidden'); }
      valid = false;
    }
    if (!prompt.trim()) {
      if (promptErr) { promptErr.textContent = '请输入人物提示词'; promptErr.classList.remove('hidden'); }
      valid = false;
    }
    if (!valid) return;
    var msgEl = document.getElementById('successCharacterMessage');
    if (msgEl) msgEl.textContent = '已成功添加 1 个人物';
    closeAddCharacterModal();
    toggleModal('successCharacterModal');
  }
  window.updateCharCount = updateCharCount;
  window.closeAddCharacterModal = closeAddCharacterModal;
  window.validateAndSubmitCharacter = validateAndSubmitCharacter;

  // ---------- 设置标签页 ----------
  function switchSettingsTab(index) {
    const navButtons = document.querySelectorAll('#settingsNav button');
    const sections = document.querySelectorAll('#settingsContent section');
    const activeClass = 'w-full text-left px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm transition-all border border-blue-100';
    const inactiveClass = 'w-full text-left px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium text-sm transition-all';

    navButtons.forEach(function (btn, i) {
      btn.className = i === index ? activeClass : inactiveClass;
    });
    sections.forEach(function (sec, i) {
      sec.classList.toggle('hidden', i !== index);
    });
  }

  window.switchSettingsTab = switchSettingsTab;

  // ---------- 根据 Hash 初始化视图 ----------
  function initViewFromHash() {
    if (window.location.hash === '#project') {
      switchView('projectView');
    } else {
      switchView('dashboardView');
    }
  }

  // ---------- 视觉提示词区域：点击切换为截图2详情视图 ----------
  function showVisualDetail() {
    var defaultView = document.getElementById('groupCard1Default');
    var detailView = document.getElementById('groupCard1Detail');
    if (defaultView && detailView) {
      defaultView.classList.add('hidden');
      detailView.classList.remove('hidden');
    }
  }

  function backToVisualDefault() {
    var defaultView = document.getElementById('groupCard1Default');
    var detailView = document.getElementById('groupCard1Detail');
    if (defaultView && detailView) {
      detailView.classList.add('hidden');
      defaultView.classList.remove('hidden');
    }
  }

  window.showVisualDetail = showVisualDetail;
  window.backToVisualDefault = backToVisualDefault;

  // ---------- 图片提示词输入框：聚焦延伸、失焦收起 ----------
  function bindImagePromptExpand() {
    var block = document.getElementById('detailImagePromptBlock');
    if (!block) return;
    var wrap = block.querySelector('.image-prompt-input-wrap');
    var input = block.querySelector('.image-prompt-input');
    if (!wrap || !input) return;
    input.addEventListener('focus', function () {
      wrap.classList.add('expanded');
    });
    input.addEventListener('blur', function () {
      wrap.classList.remove('expanded');
    });
  }

  // ---------- 温度参数滑块：实时显示数值 ----------
  function bindTemperatureSlider() {
    var slider = document.getElementById('temperatureSlider');
    var valueDisplay = document.getElementById('temperatureValue');
    if (!slider || !valueDisplay) return;
    slider.addEventListener('input', function () {
      valueDisplay.textContent = parseFloat(slider.value).toFixed(1);
    });
    // 初始化显示
    valueDisplay.textContent = parseFloat(slider.value).toFixed(1);
  }

  // ---------- 图像生成引擎切换：ComfyUI / Banana ----------
  function applyImageEngine(value) {
    var comfy = document.getElementById('imageComfySettings');
    var banana = document.getElementById('imageBananaSettings');
    if (!comfy || !banana) return;

    comfy.classList.add('hidden');
    banana.classList.add('hidden');

    if (value === 'comfyui') {
      comfy.classList.remove('hidden');
    } else if (value === 'banana') {
      banana.classList.remove('hidden');
    }
  }

  function bindImageEngineSwitch() {
    var radios = document.querySelectorAll('input[name="img_engine"]');
    if (!radios.length) return;

    radios.forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (radio.checked) {
          applyImageEngine(radio.value);
        }
      });
    });

    var checked = Array.prototype.slice.call(radios).find(function (r) { return r.checked; });
    applyImageEngine(checked ? checked.value : 'comfyui');
  }

  // ---------- 视频生成引擎切换：按选择显示对应配置 ----------
  function applyVideoEngine(value) {
    var comfy = document.getElementById('videoComfySettings');
    var sora = document.getElementById('videoSoraSettings');
    var veo = document.getElementById('videoVeoSettings');
    if (!comfy || !sora || !veo) return;

    comfy.classList.add('hidden');
    sora.classList.add('hidden');
    veo.classList.add('hidden');

    if (value === 'comfyui') {
      comfy.classList.remove('hidden');
    } else if (value === 'sora2') {
      sora.classList.remove('hidden');
    } else if (value === 'veo3') {
      veo.classList.remove('hidden');
    }
  }

  function bindVideoEngineSwitch() {
    var radios = document.querySelectorAll('input[name="vid_engine"]');
    if (!radios.length) return;

    radios.forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (radio.checked) {
          applyVideoEngine(radio.value);
        }
      });
    });

    var checked = Array.prototype.slice.call(radios).find(function (r) { return r.checked; });
    applyVideoEngine(checked ? checked.value : 'comfyui');
  }

  // 提供给内联事件使用（防止绑定失败时兜底）
  window.selectVideoEngine = applyVideoEngine;

  // ---------- 绑定 data-action 按钮 ----------
  var actions = {
    'nav-file': function () { toast('文件菜单（前端演示）'); },
    'nav-service': function () { toast('客服（前端演示）'); },
    'nav-help': function () { toast('帮助（前端演示）'); },
    'refresh': function () { toast('已刷新项目列表'); },
    'batch': function () { toast('批量处理（前端演示）'); },
    'create-submit': function () {
      toggleModal('createProjectModal');
      toast('项目已创建（演示）', 'success');
    },
    'settings-save': function () {
      toggleModal('settingsModal');
      toast('设置已保存', 'success');
    },
    'settings-reset': function () { toast('已重置为默认值'); },
    'show-visual-detail': showVisualDetail,
    'back-to-visual-default': backToVisualDefault
  };

  function bindActions() {
    document.querySelectorAll('[data-action]').forEach(function (btn) {
      var action = btn.getAttribute('data-action');
      if (actions[action]) {
        btn.addEventListener('click', actions[action]);
      }
    });

    // 剪映设置：关键帧 放大/缩小
    document.querySelectorAll('#settingsContent .setting-card h3 + .flex button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        // 按钮样式切换
        document.querySelectorAll('#settingsContent .setting-card h3 + .flex button').forEach(function (b) {
          b.classList.remove('bg-blue-600', 'text-white');
          b.classList.add('bg-slate-100', 'text-slate-500');
        });
        btn.classList.remove('bg-slate-100', 'text-slate-500');
        btn.classList.add('bg-blue-600', 'text-white');

        // 数值与文案切换
        var card = btn.closest('.setting-card');
        if (!card) return;
        var startInput = card.querySelector('input[data-role="keyframe-start"]');
        var endInput = card.querySelector('input[data-role="keyframe-end"]');
        var labels = card.querySelectorAll('[data-role="keyframe-scale-label"]');
        if (!startInput || !endInput || !labels.length) return;

        var isShrink = btn.textContent.trim() === '缩小';
        if (isShrink) {
          // 缩小：开始 133，结束 100，文案「缩小值」
          startInput.value = 133;
          endInput.value = 100;
          labels.forEach(function (el) { el.textContent = '缩小值:'; });
        } else {
          // 放大：开始 100，结束 133，文案「放大值」
          startInput.value = 100;
          endInput.value = 133;
          labels.forEach(function (el) { el.textContent = '放大值:'; });
        }
      });
    });
  }

  // ---------- 入口 ----------
  function init() {
    initViewFromHash();
    window.addEventListener('hashchange', initViewFromHash);
    bindActions();
    bindImagePromptExpand();
    bindTemperatureSlider();
    bindImageEngineSwitch();
    bindVideoEngineSwitch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
