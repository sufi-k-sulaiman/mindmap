import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { base44 } from "@/api/base44Client";
import { 
    Play, Pause, X, Loader2, Target, Zap, Trophy, Heart, Clock, 
    Crosshair, Volume2, VolumeX, RotateCcw, ChevronRight, Lock
} from 'lucide-react';

const TOPICS = {
    programming: [
        { id: 'algorithms', label: 'Algorithms', topic: 'Algorithm concepts and data structures' },
        { id: 'webdev', label: 'Web Development', topic: 'HTML, CSS, JavaScript and frameworks' },
        { id: 'databases', label: 'Databases', topic: 'SQL, NoSQL, and database design' },
        { id: 'security', label: 'Cybersecurity', topic: 'Security concepts and best practices' },
        { id: 'cloud', label: 'Cloud Computing', topic: 'AWS, Azure, and cloud architecture' },
    ],
    science: [
        { id: 'physics', label: 'Physics', topic: 'Physics laws and quantum mechanics' },
        { id: 'chemistry', label: 'Chemistry', topic: 'Chemical reactions and elements' },
        { id: 'biology', label: 'Biology', topic: 'Life sciences and genetics' },
        { id: 'astronomy', label: 'Astronomy', topic: 'Space, planets, and the universe' },
        { id: 'earth', label: 'Earth Science', topic: 'Geology, weather, and climate' },
    ],
    history: [
        { id: 'ancient', label: 'Ancient History', topic: 'Ancient civilizations and empires' },
        { id: 'medieval', label: 'Medieval Era', topic: 'Middle ages and feudalism' },
        { id: 'modern', label: 'Modern History', topic: '19th and 20th century events' },
        { id: 'wars', label: 'World Wars', topic: 'WWI, WWII, and major conflicts' },
        { id: 'art', label: 'Art History', topic: 'Art movements and famous artists' },
    ],
    business: [
        { id: 'marketing', label: 'Marketing', topic: 'Marketing strategies and branding' },
        { id: 'finance', label: 'Finance', topic: 'Financial concepts and investing' },
        { id: 'economics', label: 'Economics', topic: 'Economic principles and theories' },
        { id: 'management', label: 'Management', topic: 'Leadership and organizational behavior' },
        { id: 'startups', label: 'Startups', topic: 'Entrepreneurship and venture capital' },
    ],
};

export default function SpaceBattleGame({ onExit }) {
    const [screen, setScreen] = useState('menu'); // menu, loading, game
    const [activeCategory, setActiveCategory] = useState('programming');
    const [enemyData, setEnemyData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [unlockedLevels, setUnlockedLevels] = useState([1]);
    const canvasRef = useRef(null);
    const gameStateRef = useRef(null);

    const generateEnemyData = async (topic) => {
        setLoading(true);
        setScreen('loading');
        try {
            const result = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate 20 educational terms for: "${topic}". Each should have a term, definition, and fun fact. Return as JSON: { "enemies": [{ "term": "Algorithm", "definition": "Step-by-step procedure", "funFact": "The word comes from mathematician Al-Khwarizmi" }] }`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        enemies: { type: "array", items: { type: "object", properties: { term: { type: "string" }, definition: { type: "string" }, funFact: { type: "string" } } } }
                    }
                }
            });
            setEnemyData(result.enemies || []);
            setScreen('game');
        } catch (error) {
            console.error('Failed to generate:', error);
            setScreen('menu');
        } finally {
            setLoading(false);
        }
    };

    const handleStartGame = (topic) => {
        generateEnemyData(topic.topic);
    };

    // Canvas game loop
    useEffect(() => {
        if (screen !== 'game' || !canvasRef.current || enemyData.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Game state
        const state = {
            mouseX: canvas.width / 2,
            mouseY: canvas.height / 2,
            score: 0,
            combo: 0,
            health: 100,
            ammo: 30,
            maxAmmo: 30,
            reloading: false,
            reloadTime: 0,
            enemies: [],
            bullets: [],
            particles: [],
            explosions: [],
            floatingTexts: [],
            enemyQueue: [...enemyData].sort(() => Math.random() - 0.5),
            spawnTimer: 0,
            gameOver: false,
            paused: false,
            kills: 0,
            time: 120,
            lastTime: Date.now(),
            muzzleFlash: 0,
            screenShake: 0,
            damageFlash: 0,
        };
        gameStateRef.current = state;

        // Event handlers
        const handleMouseMove = (e) => {
            state.mouseX = e.clientX;
            state.mouseY = e.clientY;
        };

        const handleClick = (e) => {
            if (state.gameOver || state.paused) return;
            if (state.reloading) return;
            if (state.ammo <= 0) {
                state.reloading = true;
                state.reloadTime = 60;
                return;
            }

            state.ammo--;
            state.muzzleFlash = 5;
            state.screenShake = 3;

            // Check hit
            const hitEnemy = state.enemies.find(enemy => {
                const dx = e.clientX - enemy.x;
                const dy = e.clientY - enemy.y;
                return Math.sqrt(dx * dx + dy * dy) < enemy.size;
            });

            if (hitEnemy) {
                hitEnemy.health--;
                // Hit particles
                for (let i = 0; i < 10; i++) {
                    state.particles.push({
                        x: hitEnemy.x, y: hitEnemy.y,
                        vx: (Math.random() - 0.5) * 10,
                        vy: (Math.random() - 0.5) * 10,
                        life: 30, color: '#ff4444', size: 3
                    });
                }

                if (hitEnemy.health <= 0) {
                    // Explosion
                    state.explosions.push({ x: hitEnemy.x, y: hitEnemy.y, radius: 0, maxRadius: 80, life: 30 });
                    
                    // Show knowledge
                    state.floatingTexts.push({
                        x: hitEnemy.x, y: hitEnemy.y - 50,
                        text: hitEnemy.data.term,
                        subtext: hitEnemy.data.definition,
                        fact: hitEnemy.data.funFact,
                        life: 180, vy: -1, size: 24
                    });

                    state.combo++;
                    state.score += 100 * state.combo;
                    state.kills++;
                    state.enemies = state.enemies.filter(e => e !== hitEnemy);

                    // Spawn more particles
                    for (let i = 0; i < 30; i++) {
                        const angle = (Math.PI * 2 * i) / 30;
                        state.particles.push({
                            x: hitEnemy.x, y: hitEnemy.y,
                            vx: Math.cos(angle) * (5 + Math.random() * 5),
                            vy: Math.sin(angle) * (5 + Math.random() * 5),
                            life: 40, color: hitEnemy.color, size: 4
                        });
                    }
                }
            } else {
                state.combo = 0;
            }

            // Bullet trail
            state.bullets.push({
                x1: canvas.width / 2, y1: canvas.height - 50,
                x2: e.clientX, y2: e.clientY, life: 5
            });
        };

        const handleKeyDown = (e) => {
            if (e.key === 'r' || e.key === 'R') {
                if (!state.reloading && state.ammo < state.maxAmmo) {
                    state.reloading = true;
                    state.reloadTime = 60;
                }
            }
            if (e.key === 'p' || e.key === 'P') state.paused = !state.paused;
            if (e.key === 'Escape') onExit();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);
        window.addEventListener('keydown', handleKeyDown);

        // Spawn enemy
        const spawnEnemy = () => {
            if (state.enemyQueue.length === 0) return;
            const data = state.enemyQueue.shift();
            const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
            const side = Math.floor(Math.random() * 4);
            let x, y;
            if (side === 0) { x = Math.random() * canvas.width; y = -50; }
            else if (side === 1) { x = canvas.width + 50; y = Math.random() * canvas.height * 0.7; }
            else if (side === 2) { x = Math.random() * canvas.width; y = -50; }
            else { x = -50; y = Math.random() * canvas.height * 0.7; }

            state.enemies.push({
                x, y,
                targetX: canvas.width / 2 + (Math.random() - 0.5) * 400,
                targetY: canvas.height / 2 + (Math.random() - 0.5) * 200,
                size: 40 + Math.random() * 20,
                health: 2,
                maxHealth: 2,
                speed: 1 + Math.random() * 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                data,
                wobble: Math.random() * Math.PI * 2,
            });
        };

        // Game loop
        const gameLoop = () => {
            const now = Date.now();
            const dt = (now - state.lastTime) / 1000;
            state.lastTime = now;

            if (!state.paused && !state.gameOver) {
                state.time -= dt;
                if (state.time <= 0) state.gameOver = true;
            }

            // Clear with slight trail
            ctx.fillStyle = 'rgba(10, 10, 20, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Damage flash
            if (state.damageFlash > 0) {
                ctx.fillStyle = `rgba(255, 0, 0, ${state.damageFlash / 20})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                state.damageFlash--;
            }

            // Screen shake
            if (state.screenShake > 0) {
                ctx.save();
                ctx.translate((Math.random() - 0.5) * state.screenShake * 2, (Math.random() - 0.5) * state.screenShake * 2);
                state.screenShake--;
            }

            if (!state.paused && !state.gameOver) {
                // Reload
                if (state.reloading) {
                    state.reloadTime--;
                    if (state.reloadTime <= 0) {
                        state.ammo = state.maxAmmo;
                        state.reloading = false;
                    }
                }

                // Spawn
                state.spawnTimer++;
                if (state.spawnTimer > 90 && state.enemies.length < 8 && state.enemyQueue.length > 0) {
                    spawnEnemy();
                    state.spawnTimer = 0;
                }

                // Update enemies
                state.enemies.forEach(enemy => {
                    enemy.wobble += 0.05;
                    const dx = enemy.targetX - enemy.x;
                    const dy = enemy.targetY - enemy.y;
                    enemy.x += dx * 0.02 + Math.sin(enemy.wobble) * 2;
                    enemy.y += dy * 0.02 + Math.cos(enemy.wobble) * 1;

                    // Enemy attacks when close to center
                    if (Math.abs(enemy.x - canvas.width/2) < 100 && Math.abs(enemy.y - canvas.height/2) < 100) {
                        state.health -= 0.1;
                        state.damageFlash = 10;
                        if (state.health <= 0) state.gameOver = true;
                    }
                });
            }

            // Draw doom-style corridor effect
            const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
            gradient.addColorStop(0, 'rgba(30, 30, 50, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw floor grid
            ctx.strokeStyle = 'rgba(100, 100, 150, 0.2)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 20; i++) {
                const y = canvas.height * 0.6 + i * 20;
                const perspective = i / 20;
                ctx.beginPath();
                ctx.moveTo(canvas.width * 0.2 * (1 - perspective), y);
                ctx.lineTo(canvas.width * (0.8 + 0.2 * perspective), y);
                ctx.stroke();
            }

            // Draw enemies
            state.enemies.forEach(enemy => {
                // Shadow
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.beginPath();
                ctx.ellipse(enemy.x, enemy.y + enemy.size * 0.8, enemy.size * 0.6, enemy.size * 0.2, 0, 0, Math.PI * 2);
                ctx.fill();

                // Enemy body (demon-like)
                const glow = ctx.createRadialGradient(enemy.x, enemy.y, 0, enemy.x, enemy.y, enemy.size);
                glow.addColorStop(0, enemy.color);
                glow.addColorStop(0.5, enemy.color);
                glow.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
                ctx.fill();

                // Eyes
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(enemy.x - enemy.size * 0.3, enemy.y - enemy.size * 0.2, enemy.size * 0.15, 0, Math.PI * 2);
                ctx.arc(enemy.x + enemy.size * 0.3, enemy.y - enemy.size * 0.2, enemy.size * 0.15, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(enemy.x - enemy.size * 0.3, enemy.y - enemy.size * 0.2, enemy.size * 0.08, 0, Math.PI * 2);
                ctx.arc(enemy.x + enemy.size * 0.3, enemy.y - enemy.size * 0.2, enemy.size * 0.08, 0, Math.PI * 2);
                ctx.fill();

                // Health bar
                ctx.fillStyle = '#333';
                ctx.fillRect(enemy.x - 25, enemy.y - enemy.size - 15, 50, 6);
                ctx.fillStyle = enemy.health > 1 ? '#22c55e' : '#ef4444';
                ctx.fillRect(enemy.x - 25, enemy.y - enemy.size - 15, 50 * (enemy.health / enemy.maxHealth), 6);

                // Term label
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(enemy.data.term, enemy.x, enemy.y + enemy.size + 20);
            });

            // Draw explosions
            state.explosions = state.explosions.filter(exp => {
                exp.radius += 5;
                exp.life--;
                ctx.strokeStyle = `rgba(255, 200, 50, ${exp.life / 30})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
                ctx.stroke();
                return exp.life > 0;
            });

            // Draw particles
            state.particles = state.particles.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2;
                p.life--;
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life / 40;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
                return p.life > 0;
            });

            // Draw bullet trails
            state.bullets = state.bullets.filter(b => {
                b.life--;
                ctx.strokeStyle = `rgba(255, 255, 100, ${b.life / 5})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(b.x1, b.y1);
                ctx.lineTo(b.x2, b.y2);
                ctx.stroke();
                return b.life > 0;
            });

            // Draw floating texts (knowledge popups)
            state.floatingTexts = state.floatingTexts.filter(ft => {
                ft.y += ft.vy;
                ft.life--;
                const alpha = Math.min(1, ft.life / 60);
                
                // Background
                ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
                ctx.fillRect(ft.x - 150, ft.y - 40, 300, 100);
                ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
                ctx.lineWidth = 2;
                ctx.strokeRect(ft.x - 150, ft.y - 40, 300, 100);

                // Text
                ctx.fillStyle = `rgba(100, 200, 255, ${alpha})`;
                ctx.font = 'bold 18px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(ft.text, ft.x, ft.y - 15);
                
                ctx.fillStyle = `rgba(200, 200, 200, ${alpha})`;
                ctx.font = '12px Arial';
                ctx.fillText(ft.subtext?.slice(0, 50) + '...', ft.x, ft.y + 5);
                
                ctx.fillStyle = `rgba(255, 200, 100, ${alpha})`;
                ctx.font = 'italic 11px Arial';
                ctx.fillText('💡 ' + (ft.fact?.slice(0, 45) || '') + '...', ft.x, ft.y + 25);

                return ft.life > 0;
            });

            // Draw weapon/crosshair
            ctx.save();
            ctx.translate(state.mouseX, state.mouseY);

            // Crosshair
            ctx.strokeStyle = state.reloading ? '#ff4444' : '#00ff00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-30, 0); ctx.lineTo(-10, 0);
            ctx.moveTo(30, 0); ctx.lineTo(10, 0);
            ctx.moveTo(0, -30); ctx.lineTo(0, -10);
            ctx.moveTo(0, 30); ctx.lineTo(0, 10);
            ctx.stroke();
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Muzzle flash
            if (state.muzzleFlash > 0) {
                ctx.fillStyle = `rgba(255, 200, 50, ${state.muzzleFlash / 5})`;
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height - 30, 30, 0, Math.PI * 2);
                ctx.fill();
                state.muzzleFlash--;
            }

            // Gun at bottom
            ctx.fillStyle = '#333';
            ctx.fillRect(canvas.width / 2 - 40, canvas.height - 80, 80, 100);
            ctx.fillStyle = '#555';
            ctx.fillRect(canvas.width / 2 - 30, canvas.height - 120, 60, 50);

            if (state.screenShake > 0) ctx.restore();

            // HUD
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`SCORE: ${state.score}`, 20, 40);
            ctx.fillText(`COMBO: x${state.combo}`, 20, 70);
            ctx.fillText(`TIME: ${Math.ceil(state.time)}s`, 20, 100);
            ctx.fillText(`KILLS: ${state.kills}/${enemyData.length}`, 20, 130);

            // Health bar
            ctx.fillStyle = '#333';
            ctx.fillRect(canvas.width - 220, 20, 200, 20);
            ctx.fillStyle = state.health > 30 ? '#22c55e' : '#ef4444';
            ctx.fillRect(canvas.width - 220, 20, 200 * (state.health / 100), 20);
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(`HEALTH: ${Math.ceil(state.health)}%`, canvas.width - 20, 55);

            // Ammo
            ctx.fillText(`AMMO: ${state.ammo}/${state.maxAmmo}${state.reloading ? ' RELOADING...' : ''}`, canvas.width - 20, 80);

            // Pause/Game Over overlay
            if (state.paused) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 60px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2 - 20);
                ctx.font = '24px Arial';
                ctx.fillText('Press P to resume | ESC to exit', canvas.width / 2, canvas.height / 2 + 30);
            }

            if (state.gameOver) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#ef4444';
                ctx.font = 'bold 60px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('MISSION COMPLETE', canvas.width / 2, canvas.height / 2 - 60);
                ctx.fillStyle = '#3b82f6';
                ctx.font = 'bold 36px Arial';
                ctx.fillText(`Final Score: ${state.score}`, canvas.width / 2, canvas.height / 2);
                ctx.fillText(`Enemies Defeated: ${state.kills}`, canvas.width / 2, canvas.height / 2 + 50);
                ctx.fillStyle = '#888';
                ctx.font = '24px Arial';
                ctx.fillText('Press ESC to return', canvas.width / 2, canvas.height / 2 + 120);
                return;
            }

            animationId = requestAnimationFrame(gameLoop);
        };

        gameLoop();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('keydown', handleKeyDown);
            cancelAnimationFrame(animationId);
        };
    }, [screen, enemyData, onExit]);

    if (screen === 'loading') {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black z-[9999]">
                <div className="text-center">
                    <Loader2 className="w-20 h-20 animate-spin mx-auto mb-6 text-red-500" />
                    <h2 className="text-3xl font-bold mb-2 text-white">Generating Enemies...</h2>
                    <p className="text-lg text-gray-400">AI is creating your battle arena</p>
                </div>
            </div>
        );
    }

    if (screen === 'game') {
        return (
            <div className="fixed inset-0 bg-black z-[9999] cursor-none">
                <canvas ref={canvasRef} className="block w-full h-full" />
                <Button onClick={onExit} className="absolute top-4 right-4 bg-red-600 hover:bg-red-700" size="sm">
                    <X className="w-4 h-4 mr-1" /> Exit
                </Button>
            </div>
        );
    }

    // Menu screen
    return (
        <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-red-950 to-black z-[9999] overflow-auto p-8">
            <Button onClick={onExit} className="absolute top-4 right-4 bg-red-600 hover:bg-red-700">
                <X className="w-4 h-4 mr-2" /> Close
            </Button>

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <div className="text-6xl mb-6">🔫</div>
                    <h1 className="text-5xl font-black text-white mb-4" style={{ textShadow: '0 0 40px rgba(239, 68, 68, 0.5)' }}>KNOWLEDGE DOOM</h1>
                    <p className="text-xl text-gray-400">First-Person Educational Shooter</p>
                </div>

                <Card className="p-6 mb-8 bg-gray-900/80 border-red-500/50">
                    <div className="flex gap-2 mb-6 flex-wrap justify-center">
                        {Object.keys(TOPICS).map(cat => (
                            <Button key={cat} onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 ${activeCategory === cat ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gray-700'} text-white`}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </Button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {TOPICS[activeCategory].map((topic, i) => (
                            <Button key={topic.id} onClick={() => handleStartGame(topic)} 
                                className="h-24 text-left justify-start p-6 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white">
                                <div>
                                    <div className="text-lg font-bold mb-1">{topic.label}</div>
                                    <div className="text-xs opacity-80">{topic.topic}</div>
                                </div>
                            </Button>
                        ))}
                    </div>
                </Card>

                <div className="grid grid-cols-3 gap-6">
                    <Card className="p-6 text-center bg-gray-900/80 border-gray-700">
                        <Crosshair className="w-12 h-12 mx-auto mb-4 text-red-500" />
                        <h3 className="text-lg font-bold mb-2 text-white">Aim & Shoot</h3>
                        <p className="text-sm text-gray-400">Click to destroy enemies and learn</p>
                    </Card>
                    <Card className="p-6 text-center bg-gray-900/80 border-gray-700">
                        <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                        <h3 className="text-lg font-bold mb-2 text-white">Build Combos</h3>
                        <p className="text-sm text-gray-400">Chain kills for bonus points</p>
                    </Card>
                    <Card className="p-6 text-center bg-gray-900/80 border-gray-700">
                        <Trophy className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                        <h3 className="text-lg font-bold mb-2 text-white">Learn Facts</h3>
                        <p className="text-sm text-gray-400">Each kill reveals knowledge</p>
                    </Card>
                </div>

                <div className="text-center mt-8 text-gray-500 text-sm">
                    <p>Controls: Mouse to aim | Click to shoot | R to reload | P to pause | ESC to exit</p>
                </div>
            </div>
        </div>
    );
}