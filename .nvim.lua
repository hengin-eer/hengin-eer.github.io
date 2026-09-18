local root = vim.fn.fnamemodify(debug.getinfo(1, "S").source:sub(2), ":p:h")
local formatter_for_extension = {
  astro = "prettier",
  css = "oxfmt",
  cjs = "oxfmt",
  js = "oxfmt",
  json = "oxfmt",
  jsonc = "oxfmt",
  jsx = "oxfmt",
  mjs = "oxfmt",
  ts = "oxfmt",
  tsx = "oxfmt",
  yaml = "oxfmt",
  yml = "oxfmt",
}

vim.api.nvim_create_autocmd("BufWritePre", {
  group = vim.api.nvim_create_augroup("HenginEerFormat", { clear = true }),
  callback = function(args)
    local buffer = args.buf
    local path = vim.api.nvim_buf_get_name(buffer)
    local extension = vim.fn.fnamemodify(path, ":e")
    local formatter = formatter_for_extension[extension]

    if path == "" or not formatter or not vim.bo[buffer].modifiable then
      return
    end

    local executable = root .. "/node_modules/.bin/" .. formatter
    local config = root
      .. (formatter == "prettier" and "/.prettierrc.ts" or "/.oxfmtrc.json")
    if vim.fn.executable(executable) ~= 1 then
      vim.notify(
        "Run npm ci before using this repository formatter",
        vim.log.levels.WARN
      )
      return
    end

    local input = table.concat(vim.api.nvim_buf_get_lines(buffer, 0, -1, false), "\n")
    if vim.bo[buffer].endofline then
      input = input .. "\n"
    end

    local result = vim.system(
      { executable, "--config", config, "--stdin-filepath", path },
      { cwd = root, stdin = input, text = true }
    ):wait()
    if result.code ~= 0 then
      vim.notify(
        string.format("%s failed: %s", formatter, result.stderr),
        vim.log.levels.ERROR
      )
      return
    end

    if result.stdout ~= input then
      local lines = vim.split(result.stdout, "\n", { plain = true })
      if lines[#lines] == "" then
        table.remove(lines)
      end
      vim.api.nvim_buf_set_lines(buffer, 0, -1, false, lines)
      vim.bo[buffer].endofline = result.stdout:sub(-1) == "\n"
    end
  end,
})
