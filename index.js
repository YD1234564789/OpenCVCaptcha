// 等待OpenCV.js加載完成
function onOpenCvReady() {
    console.log('OpenCV.js已準備就緒');
    document.getElementById('processButton').disabled = false;
    loadReferenceAlphabet();
}

// 全局變量用於存儲字母參考圖像
let alphabetReference = {};
let processingParams = {
    erosionSize: 4,
    gaussianBlurSize: 5,
    cannyThreshold1: 30,
    cannyThreshold2: 150,
    dilationSize: 4,
    contourMinWidth: 15,
    contourMinHeight: 15
};

// 加載參考字母文件夾
function loadReferenceAlphabet() {
    const alphabetChars = 'abcdefghijklmnopqrstuvwxyz';
    let loadedCount = 0;
    
    // 顯示加載狀態
    document.getElementById('loadingStatus').textContent = '正在加載參考字母...';
    
    // 為每個字母加載參考圖像
    for (let char of alphabetChars) {
        const img = new Image();
        img.onload = function() {
            // 將圖像轉換為OpenCV格式
            const mat = cv.imread(img);
            
            // 轉換為灰度
            const gray = new cv.Mat();
            cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
            
            // 調整為標準大小 (50x50)
            const resized = new cv.Mat();
            cv.resize(gray, resized, new cv.Size(50, 50));
            
            // 存儲參考圖像
            alphabetReference[char] = resized;
            
            // 釋放資源
            mat.delete();
            gray.delete();
            
            loadedCount++;
            if (loadedCount === alphabetChars.length) {
                document.getElementById('loadingStatus').textContent = '參考字母已加載完成！';
                console.log('所有參考字母已加載完成');
            }
        };
        
        img.onerror = function() {
            console.error(`無法加載字母 ${char} 的參考圖像`);
            loadedCount++;
            
            if (loadedCount === alphabetChars.length) {
                document.getElementById('loadingStatus').textContent = 
                    '部分參考字母加載失敗。請確保./alphabet文件夾中有所有字母圖像。';
            }
        };
        
        // 設置圖像路徑
        img.src = `./alphabet/${char}.png`;
    }
}

// 檢查OpenCV.js是否已加載
if (typeof cv !== 'undefined') {
    onOpenCvReady();
} else {
    // 如果尚未加載，設置回調函數
    window.onload = function() {
        document.getElementById('processButton').disabled = true;
        cv['onRuntimeInitialized'] = onOpenCvReady;
        
        // 初始化參數控制UI
        initParameterControls();
    };
}

// 初始化參數控制UI
function initParameterControls() {
    // 創建參數控制面板
    const controlsContainer = document.getElementById('parameterControls');
    if (!controlsContainer) return;
    
    // 創建各個參數的滑塊
    createSlider(controlsContainer, '腐蝕核大小', 'erosionSize', 1, 10, processingParams.erosionSize);
    createSlider(controlsContainer, '高斯模糊核大小', 'gaussianBlurSize', 1, 15, processingParams.gaussianBlurSize, 2);
    createSlider(controlsContainer, 'Canny閾值1', 'cannyThreshold1', 1, 100, processingParams.cannyThreshold1);
    createSlider(controlsContainer, 'Canny閾值2', 'cannyThreshold2', 50, 300, processingParams.cannyThreshold2);
    createSlider(controlsContainer, '膨脹核大小', 'dilationSize', 1, 10, processingParams.dilationSize);
    createSlider(controlsContainer, '輪廓最小寬度', 'contourMinWidth', 5, 30, processingParams.contourMinWidth);
    createSlider(controlsContainer, '輪廓最小高度', 'contourMinHeight', 5, 30, processingParams.contourMinHeight);
    
    // 添加重置按鈕
    const resetButton = document.createElement('button');
    resetButton.textContent = '重置參數';
    resetButton.onclick = function() {
        // 重置為默認值
        processingParams = {
            erosionSize: 4,
            gaussianBlurSize: 5,
            cannyThreshold1: 30,
            cannyThreshold2: 150,
            dilationSize: 4,
            contourMinWidth: 15,
            contourMinHeight: 15
        };
        
        // 更新UI
        document.getElementById('erosionSize').value = processingParams.erosionSize;
        document.getElementById('erosionSizeValue').textContent = processingParams.erosionSize;
        
        document.getElementById('gaussianBlurSize').value = processingParams.gaussianBlurSize;
        document.getElementById('gaussianBlurSizeValue').textContent = processingParams.gaussianBlurSize;
        
        document.getElementById('cannyThreshold1').value = processingParams.cannyThreshold1;
        document.getElementById('cannyThreshold1Value').textContent = processingParams.cannyThreshold1;
        
        document.getElementById('cannyThreshold2').value = processingParams.cannyThreshold2;
        document.getElementById('cannyThreshold2Value').textContent = processingParams.cannyThreshold2;
        
        document.getElementById('dilationSize').value = processingParams.dilationSize;
        document.getElementById('dilationSizeValue').textContent = processingParams.dilationSize;
        
        document.getElementById('contourMinWidth').value = processingParams.contourMinWidth;
        document.getElementById('contourMinWidthValue').textContent = processingParams.contourMinWidth;
        
        document.getElementById('contourMinHeight').value = processingParams.contourMinHeight;
        document.getElementById('contourMinHeightValue').textContent = processingParams.contourMinHeight;
    };
    controlsContainer.appendChild(resetButton);
}

// 創建滑塊控制元素
function createSlider(container, label, id, min, max, value, step = 1) {
    const div = document.createElement('div');
    div.className = 'parameter-control';
    
    const labelElem = document.createElement('label');
    labelElem.htmlFor = id;
    labelElem.textContent = label + ': ';
    
    const valueSpan = document.createElement('span');
    valueSpan.id = id + 'Value';
    valueSpan.textContent = value;
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = id;
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = value;
    slider.oninput = function() {
        const val = parseFloat(this.value);
        processingParams[id] = val;
        valueSpan.textContent = val;
    };
    
    labelElem.appendChild(valueSpan);
    div.appendChild(labelElem);
    div.appendChild(slider);
    container.appendChild(div);
}

// 將Mat對象轉換為圖像URL並顯示在<img>元素中
function displayMatToImg(mat, imgElement) {
    try {
        // 創建臨時畫布來轉換Mat為ImageData
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = mat.cols;
        tempCanvas.height = mat.rows;
        
        // 對於二值圖像或灰度圖像，需要轉換為RGB
        let displayMat = new cv.Mat();
        
        if (mat.type() === cv.CV_8UC1) {
            // 如果是單通道圖像（灰度或二值），轉換為3通道
            cv.cvtColor(mat, displayMat, cv.COLOR_GRAY2RGBA);
        } else {
            mat.copyTo(displayMat);
        }
        
        // 將Mat轉換為ImageData
        const ctx = tempCanvas.getContext('2d');
        const imgData = new ImageData(
            new Uint8ClampedArray(displayMat.data), 
            displayMat.cols, 
            displayMat.rows
        );
        ctx.putImageData(imgData, 0, 0);
        
        // 將畫布內容轉換為DataURL並設置給<img>元素
        imgElement.src = tempCanvas.toDataURL();
        
        // 釋放資源
        displayMat.delete();
        
    } catch (error) {
        console.error('顯示Mat圖像時出錯:', error);
    }
}

// 主處理函數，將在按鈕點擊時觸發
document.getElementById('processButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
        alert('請先選擇一個PNG圖片。');
        return;
    }

    // 檢查參考字母是否已加載
    if (Object.keys(alphabetReference).length === 0) {
        alert('參考字母尚未加載完成。請等待加載完成後再試。');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            processCaptchaImage(img);
        };
        img.src = e.target.result;
        
        // 顯示原始圖像
        document.getElementById('originalImage').src = e.target.result;
    };

    reader.readAsDataURL(file);
});

/**
 * 處理驗證碼圖像的主函數
 * @param {HTMLImageElement} imgElement - 輸入圖像元素
 */
function processCaptchaImage(imgElement) {
    // 清除先前的結果
    document.getElementById('characters').innerHTML = '';
    document.getElementById('results').innerHTML = '';
    
    // 步驟1：將圖像轉換為Mat（OpenCV矩陣）
    let src = cv.imread(imgElement);
    
    // 步驟2：應用腐蝕操作
    // 使用參數控制腐蝕核大小
    const kernel = cv.Mat.ones(processingParams.erosionSize, processingParams.erosionSize, cv.CV_8U);
    let erosion = new cv.Mat();
    
    // 應用腐蝕操作
    cv.erode(src, erosion, kernel, new cv.Point(-1, -1), 1);
    
    // 顯示腐蝕結果
    displayMatToImg(erosion, document.getElementById('erosionImage'));
    
    // 步驟3：應用高斯模糊
    let blurred = new cv.Mat();
    
    // 應用高斯模糊，使用參數控制核大小
    // 確保核大小為奇數
    const blurSize = processingParams.gaussianBlurSize % 2 === 0 ? 
                     processingParams.gaussianBlurSize + 1 : 
                     processingParams.gaussianBlurSize;
    
    cv.GaussianBlur(erosion, blurred, new cv.Size(blurSize, blurSize), 0);
    
    // 顯示模糊結果
    displayMatToImg(blurred, document.getElementById('blurImage'));
    
    // 步驟4：應用Canny邊緣檢測
    let edged = new cv.Mat();
    
    // 應用Canny邊緣檢測，使用參數控制閾值
    cv.Canny(blurred, edged, processingParams.cannyThreshold1, processingParams.cannyThreshold2);
    
    // 顯示邊緣檢測結果
    displayMatToImg(edged, document.getElementById('cannyImage'));
    
    // 步驟5：應用膨脹操作
    let dilation = new cv.Mat();
    
    // 創建膨脹核
    const dilateKernel = cv.Mat.ones(processingParams.dilationSize, processingParams.dilationSize, cv.CV_8U);
    
    // 應用膨脹操作
    cv.dilate(edged, dilation, dilateKernel, new cv.Point(-1, -1), 1);
    
    // 顯示膨脹結果
    displayMatToImg(dilation, document.getElementById('dilationImage'));
    
    // 步驟6：查找輪廓
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    
    // 創建一個拷貝用於findContours，因為這個操作會修改輸入圖像
    let dilationCopy = dilation.clone();
    
    // 在膨脹後的圖像中查找輪廓
    cv.findContours(dilationCopy, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    
    console.log(`找到 ${contours.size()} 個輪廓`);
    
    // 步驟7：按x坐標排序輪廓並按大小過濾
    let validContours = [];
    
    for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const rect = cv.boundingRect(contour);
        
        // 添加到數組中，帶有用於排序的x坐標
        validContours.push({
            contour: contour,
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
        });
    }
    
    // 按x坐標排序輪廓
    validContours.sort((a, b) => a.x - b.x);
    
    // 按大小過濾輪廓（使用參數控制最小尺寸）
    const filteredContours = validContours.filter(c => 
        c.width > processingParams.contourMinWidth && 
        c.height > processingParams.contourMinHeight
    );
    
    console.log(`找到 ${filteredContours.length} 個有效字符輪廓`);
    
    // 步驟8：提取並調整字符區域大小
    const charactersContainer = document.getElementById('characters');
    const characterImages = [];
    
    // 用於顯示的原始圖像
    let srcDisplay = src.clone();
    
    for (let i = 0; i < filteredContours.length; i++) {
        const { x, y, width, height } = filteredContours[i];
        
        // 在顯示圖像上繪製輪廓
        cv.rectangle(srcDisplay, new cv.Point(x, y), new cv.Point(x + width, y + height), 
                    new cv.Scalar(0, 255, 0, 255), 2);
        
        // 創建感興趣區域(ROI)
        const roi = new cv.Mat();
        const rect = new cv.Rect(x, y, width, height);
        
        // 從灰度圖像中提取ROI
        let grayImg = new cv.Mat();
        cv.cvtColor(src, grayImg, cv.COLOR_RGBA2GRAY);
        const roiRect = grayImg.roi(rect);
        roiRect.copyTo(roi);
        
        // 調整大小為50x50像素
        const resized = new cv.Mat();
        cv.resize(roi, resized, new cv.Size(50, 50));
        
        // 創建一個<img>元素來顯示字符
        const charImg = document.createElement('img');
        charImg.width = 50;
        charImg.height = 50;
        
        // 使用函數將Mat顯示為圖像
        displayMatToImg(resized, charImg);
        
        // 將圖像添加到頁面
        const container = document.createElement('div');
        container.className = 'image-container';
        container.appendChild(charImg);
        
        const label = document.createElement('div');
        label.id = `char-label-${i}`;
        label.textContent = `字符 ${i}`;
        container.appendChild(label);
        
        charactersContainer.appendChild(container);
        
        // 保存圖像以供後續識別
        characterImages.push({
            index: i,
            image: resized.clone()
        });
        
        // 釋放資源
        roi.delete();
        roiRect.delete();
        grayImg.delete();
    }
    
    // 顯示帶有標記輪廓的圖像
    displayMatToImg(srcDisplay, document.getElementById('contoursImage'));
    
    // 步驟9：識別字符
    recognizeCharacters(characterImages);
    
    // 釋放資源
    src.delete();
    srcDisplay.delete();
    erosion.delete();
    blurred.delete();
    edged.delete();
    dilation.delete();
    dilationCopy.delete();
    contours.delete();
    hierarchy.delete();
    kernel.delete();
    dilateKernel.delete();
}

/**
 * 字符識別函數
 * 將提取的字符與參考字母進行比較
 * @param {Array} characterImages - 字符圖像數組
 */
function recognizeCharacters(characterImages) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>識別結果：</p>';
    
    let captchaText = '';
    
    for (let i = 0; i < characterImages.length; i++) {
        const charImage = characterImages[i].image;
        const result = recognizeCharacter(charImage);
        
        // 更新字符容器中的標籤
        const label = document.getElementById(`char-label-${i}`);
        if (label) {
            label.textContent = `字符 ${i}: ${result.character} (誤差: ${result.error.toFixed(2)})`;
        }
        
        captchaText += result.character;
    }
    
    resultsDiv.innerHTML += `<p>識別出的驗證碼文本: <strong>${captchaText}</strong></p>`;
    
    // 釋放資源
    for (let char of characterImages) {
        char.image.delete();
    }
}

/**
 * MSE（均方誤差）函數用於比較兩個圖像
 * @param {cv.Mat} imageA - 第一個圖像
 * @param {cv.Mat} imageB - 第二個圖像
 * @returns {number} - 均方誤差值
 */
function mse(imageA, imageB) {
    // 如果需要，將圖像轉換為相同大小
    const resizedB = new cv.Mat();
    if (imageA.rows !== imageB.rows || imageA.cols !== imageB.cols) {
        cv.resize(imageB, resizedB, new cv.Size(imageA.cols, imageA.rows));
    } else {
        imageB.copyTo(resizedB);
    }
    
    // 計算差異
    const diff = new cv.Mat();
    cv.absdiff(imageA, resizedB, diff);
    
    // 計算差異的平方
    const squaredDiff = new cv.Mat();
    cv.multiply(diff, diff, squaredDiff);
    
    // 計算平均值
    const mean = cv.mean(squaredDiff);
    
    // 對通道求和（對於灰度圖像只有一個通道）
    const error = mean[0];
    
    // 釋放資源
    diff.delete();
    squaredDiff.delete();
    resizedB.delete();
    
    return error;
}

/**
 * 識別字符函數
 * 通過將其與字母文件夾中的參考圖像進行比較
 * @param {cv.Mat} charImage - 要識別的字符圖像
 * @returns {Object} - 包含識別出的字符和誤差的對象
 */
function recognizeCharacter(charImage) {
    let bestMatch = '?';
    let lowestError = Infinity;
    
    // 與每個參考字母比較
    for (let char in alphabetReference) {
        const referenceImage = alphabetReference[char];
        const error = mse(charImage, referenceImage);
        
        // 如果誤差較低，則更新最佳匹配
        if (error < lowestError) {
            lowestError = error;
            bestMatch = char;
        }
    }
    
    return {
        character: bestMatch,
        error: lowestError
    };
}