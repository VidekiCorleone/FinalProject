using project_alpha_0._1.osztalyok;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace project_alpha_0._1
{
    public partial class userEditAdd : Form
    {
        public userEditAdd()
        {
            InitializeComponent();
            Start();
            button1.Click += backBtn;
            button2.Click += addBtn;
        }

        public void Start()
        {
            this.FormBorderStyle = FormBorderStyle.None;

            this.BackColor = Color.FromArgb(93, 135, 54);
            label1.BackColor = Color.FromArgb(93, 135, 54);
            label2.BackColor = Color.FromArgb(93, 135, 54);
            label3.BackColor = Color.FromArgb(93, 135, 54);
            label4.BackColor = Color.FromArgb(93, 135, 54);
            label5.BackColor = Color.FromArgb(93, 135, 54);
            label6.BackColor = Color.FromArgb(93, 135, 54);

            label1.Text = "Felhasználó hozzáadása";
            label2.Text = "Név:";
            label3.Text = "Felhasználónév:";
            label4.Text = "E-mail:";
            label5.Text = "Telefonszám:";
            label6.Text = "Jelszó:";
            label7.Text = "Szerepkör:";
            button1.Text = "Vissza";
            button2.Text = "Módosítás";

            int label1Mid = label1.Width / 2;
            int button1Mid = button1.Width / 2;
            //int button2Mid = button2.Width / 2;
            //int label2Right = label2.Left - label2.Width;
            //int label3Right = label3.Left - label3.Width;
            //int label4Right = label4.Left - label4.Width;


            label1.Left = this.Width / 2 - label1Mid;
            button1.Left = this.Width / 2 - button1.Width - 40;
            button2.Left = this.Width / 2 + 40;

            textBox1.Left = button1.Left + button1Mid + 10;
            textBox2.Left = button1.Left + button1Mid + 10;
            textBox3.Left = button1.Left + button1Mid + 10;
            textBox4.Left = button1.Left + button1Mid + 10;
            textBox5.Left = button1.Left + button1Mid + 10;
            textBox6.Left = button1.Left + button1Mid + 10;

            label2.Left = (button1.Left + button1Mid) - label2.Width;
            label3.Left = (button1.Left + button1Mid) - label3.Width;
            label4.Left = (button1.Left + button1Mid) - label4.Width;
            label5.Left = (button1.Left + button1Mid) - label5.Width;
            label6.Left = (button1.Left + button1Mid) - label6.Width;
            label7.Left = (button1.Left + button1Mid) - label7.Width;

            label2.Top = textBox1.Top + ((textBox1.Height / 2) - (label2.Height / 2));
            label3.Top = textBox2.Top + ((textBox2.Height / 2) - (label3.Height / 2));
            label4.Top = textBox3.Top + ((textBox3.Height / 2) - (label4.Height / 2));
            label5.Top = textBox4.Top + ((textBox4.Height / 2) - (label5.Height / 2));
            label6.Top = textBox5.Top + ((textBox5.Height / 2) - (label6.Height / 2));
            label7.Top = textBox6.Top + ((textBox6.Height / 2) - (label7.Height / 2));
        }

        public void backBtn(object s, EventArgs e)
        {
            const string message = "Biztosan vissza akarsz lépni?";
            const string caption = "Visszalépés";
            var result = MessageBox.Show(message, caption,
                                         MessageBoxButtons.YesNo,
                                         MessageBoxIcon.Question);
            if (result == DialogResult.Yes)
            {
                this.Hide();
                userEdit userEdit = new userEdit();
                userEdit.Show();
            }
        }

        public async void addBtn(object s, EventArgs e)
        {
            HttpRequestek request = new HttpRequestek();

            string name = textBox1.Text;
            string username = textBox2.Text;
            string email = textBox3.Text;
            int phone_num = int.Parse(textBox4.Text);
            string password = textBox5.Text;
            int role = int.Parse(textBox6.Text);

            if(string.IsNullOrEmpty(name) || string.IsNullOrEmpty(username) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                const string message1 = "Kérlek töltsd ki az összes mezőt!";
                const string caption1 = "Hiba";
                MessageBox.Show(message1, caption1,
                                             MessageBoxButtons.OK,
                                             MessageBoxIcon.Error);
                return;
            }

            const string message = "Biztosan hozzáadod ezt a felhasználót?";
            const string caption = "Hozzáadás";
            var result = MessageBox.Show(message, caption,
                                         MessageBoxButtons.YesNo,
                                         MessageBoxIcon.Question);
            if (result == DialogResult.Yes)
            {
                bool reqResult = await request.postRegisterUsers(username, password, email, role, name, phone_num);
                if(reqResult == true)
                {
                    MessageBox.Show("Felhasználó hozzáadva!", "Sikeres hozzáadás", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
            }






            /*const string message = "Biztosan hozzáadod ezt a felhasználót?";
            const string caption = "Hozzáadás";
            var result = MessageBox.Show(message, caption,
                                         MessageBoxButtons.YesNo,
                                         MessageBoxIcon.Question);
            if (result == DialogResult.Yes)
            {
                const string message1 = "Fejlesztés alatt";
                const string caption1 = "Hiba";
                MessageBox.Show(message1, caption1,
                                             MessageBoxButtons.OK,
                                             MessageBoxIcon.Error);
            }*/
        }
    }
}
