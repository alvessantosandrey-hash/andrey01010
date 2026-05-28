// --- SISTEMA DE CONTROLE (GAMEPAD) ---
let gamepadIndex = null;

window.addEventListener("gamepadconnected", (e) => {
    console.log("Controle conectado:", e.gamepad.id);
    gamepadIndex = e.gamepad.index;
    document.getElementById('status').innerText = "Controle Detectado!";
});

window.addEventListener("gamepaddisconnected", () => {
    gamepadIndex = null;
    document.getElementById('status').innerText = "Controle Desconectado.";
});

function handleGamepadInput() {
    if (gamepadIndex === null) return;

    const gp = navigator.getGamepads()[gamepadIndex];
    if (!gp) return;

    const speed = 0.15;
    const deadzone = 0.2; // Evita movimento fantasma se o analógico estiver gasto

    // Movimentação Horizontal (Analógico Esquerdo ou D-Pad)
    // gp.axes[0] é o eixo X do analógico esquerdo
    if (gp.axes[0] < -deadzone) {
        player.body.position.x -= speed;
    } else if (gp.axes[0] > deadzone) {
        player.body.position.x += speed;
    }

    // Pulo (Botão A no Xbox / X no PS - Geralmente index 0 ou 1)
    if (gp.buttons[0].pressed && Math.abs(player.body.velocity.y) < 0.1) {
        player.body.velocity.y = 6;
    }

    // Exemplo de Ataque (Botão X no Xbox / Quadrado no PS - Index 2)
    if (gp.buttons[2].pressed) {
        realizarAtaque(); 
    }
}

// --- FUNÇÃO DE ATAQUE (EXTENSÃO) ---
function realizarAtaque() {
    // Muda a cor temporariamente para feedback visual
    player.mesh.material.color.setHex(0xffffff);
    setTimeout(() => player.mesh.material.color.setHex(0x00ff00), 100);
    
    // Aqui você adicionaria a lógica de colisão de dano
    console.log("Atacando!");
}

// --- LOOP DE ANIMAÇÃO ATUALIZADO ---
function animate() {
    requestAnimationFrame(animate);
    world.step(1/60);
    
    updateMovement();    // Mantém teclado como backup
    handleGamepadInput(); // Adiciona suporte ao controle

    // Sincronização Visual
    player.mesh.position.copy(player.body.position);
    player.mesh.quaternion.copy(player.body.quaternion);
    opponent.mesh.position.copy(opponent.body.position);
    opponent.mesh.quaternion.copy(opponent.body.quaternion);

    renderer.render(scene, camera);
}




if (gp.vibrationActuator) {
    gp.vibrationActuator.playEffect("dual-rumble", {
        startDelay: 0,
        duration: 200,
        weakMagnitude: 1.0,
        strongMagnitude: 1.0,
    });
}
