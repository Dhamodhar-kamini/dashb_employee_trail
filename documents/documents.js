document.addEventListener('DOMContentLoaded', function() {
    
    // Select elements using the NEW UNIQUE IDs
    const docInput = document.getElementById('docFileInput');
    const docArea = document.getElementById('docDropArea');
    const docText = document.getElementById('docFileName');
    const docForm = document.getElementById('docUniqueUploadForm');

    // 1. Handle file selection via Click
    if(docInput) {
        docInput.addEventListener('change', function() {
            handleDocFiles(this.files);
        });
    }

    // 2. Handle Drag and Drop Visuals
    if(docArea) {
        // Drag Over
        docArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            docArea.style.borderColor = '#ff6b00';
            docArea.style.backgroundColor = '#fff8f0';
        });

        // Drag Leave
        docArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            docArea.style.borderColor = '#e0e0e0';
            docArea.style.backgroundColor = '#fafafa';
        });

        // Drop
        docArea.addEventListener('drop', (e) => {
            e.preventDefault();
            docArea.style.borderColor = '#e0e0e0';
            docArea.style.backgroundColor = '#fafafa';
            
            // Transfer files to input
            if(docInput) {
                docInput.files = e.dataTransfer.files;
                handleDocFiles(docInput.files);
            }
        });
    }

    // 3. Update Text Helper
    function handleDocFiles(files) {
        if (files.length > 0) {
            if (files.length === 1) {
                docText.textContent = files[0].name;
                docText.style.color = '#2c3e50'; // Dark text
            } else {
                docText.textContent = `${files.length} files ready to upload`;
                docText.style.color = '#2c3e50';
            }
        } else {
            docText.innerHTML = 'Click to browse';
            docText.style.color = '#ff6b00'; // Orange
        }
    }

    // 4. Form Submit Demo
    if(docForm) {
        docForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Just for demo purposes
            alert("Documents processing... (Backend integration required)");
        });
    }
});