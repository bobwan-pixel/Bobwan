<script>
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.game-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.game-card')) {
      document.querySelectorAll('.game-card').forEach(c => c.classList.remove('selected'));
    }
  });
</script>